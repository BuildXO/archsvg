/**
 * Symmetric layout engine
 * Balances branching around a central axis for tree-like structures
 */

import { FlowchartData, LayoutConfig, LayoutResult, PositionedNode } from '../core/types';
import { LayoutEngine, assignLevelsBFS, groupByLevel, calculateBounds, buildAdjacencyList } from './base';

export class SymmetricLayout implements LayoutEngine {
    layout(data: FlowchartData, config: LayoutConfig): LayoutResult {
        const { nodeWidth, nodeHeight, verticalSpacing, horizontalSpacing, padding } = config;
        
        // Assign levels using BFS
        const levels = assignLevelsBFS(data);
        const levelGroups = groupByLevel(data, levels);
        const adjacency = buildAdjacencyList(data);
        
        // Calculate subtree widths for balanced positioning
        const subtreeWidths = this.calculateSubtreeWidths(
            data,
            levels,
            adjacency,
            nodeWidth,
            horizontalSpacing
        );
        
        // Position nodes with symmetric balancing
        const positions: PositionedNode[] = [];
        const levelPositions = new Map<number, number>(); // Track X position per level
        
        // Start from center
        const maxLevel = Math.max(...Array.from(levels.values()));
        
        levelGroups.forEach((nodes, level) => {
            const y = padding + level * (nodeHeight + verticalSpacing);
            
            // For first level (roots), center them
            if (level === 0) {
                const totalWidth = nodes.length * nodeWidth + (nodes.length - 1) * horizontalSpacing;
                let currentX = padding;
                
                nodes.forEach((node, index) => {
                    const x = currentX + index * (nodeWidth + horizontalSpacing);
                    positions.push({ node, x, y, level });
                });
                
                levelPositions.set(level, currentX);
            } else {
                // Position based on parent positions
                nodes.forEach(node => {
                    // Find parent(s)
                    const parents = data.edges
                        .filter(e => e.to === node.id)
                        .map(e => positions.find(p => p.node.id === e.from))
                        .filter(p => p !== undefined) as PositionedNode[];
                    
                    let x: number;
                    if (parents.length > 0) {
                        // Average parent positions
                        const avgParentX = parents.reduce((sum, p) => sum + p.x, 0) / parents.length;
                        x = avgParentX;
                    } else {
                        // No parent found, use level start position
                        x = levelPositions.get(level) || padding;
                    }
                    
                    positions.push({ node, x, y, level });
                });
            }
        });
        
        // Adjust for overlaps (simple collision detection)
        this.resolveOverlaps(positions, nodeWidth, horizontalSpacing);
        
        const bounds = calculateBounds(positions, nodeWidth, nodeHeight, padding);
        
        return {
            nodes: positions,
            ...bounds
        };
    }
    
    /**
     * Calculate width needed for each subtree
     */
    private calculateSubtreeWidths(
        data: FlowchartData,
        levels: Map<string, number>,
        adjacency: Map<string, string[]>,
        nodeWidth: number,
        spacing: number
    ): Map<string, number> {
        const widths = new Map<string, number>();
        
        // Calculate from bottom-up
        const maxLevel = Math.max(...Array.from(levels.values()));
        
        for (let level = maxLevel; level >= 0; level--) {
            const nodesAtLevel = data.nodes.filter(n => levels.get(n.id) === level);
            
            nodesAtLevel.forEach(node => {
                const children = adjacency.get(node.id) || [];
                
                if (children.length === 0) {
                    widths.set(node.id, nodeWidth);
                } else {
                    const childrenWidths = children
                        .map(childId => widths.get(childId) || nodeWidth)
                        .reduce((sum, w) => sum + w, 0);
                    
                    widths.set(node.id, Math.max(nodeWidth, childrenWidths + spacing * (children.length - 1)));
                }
            });
        }
        
        return widths;
    }
    
    /**
     * Simple overlap resolution - shift nodes apart if they collide
     */
    private resolveOverlaps(positions: PositionedNode[], nodeWidth: number, minSpacing: number): void {
        // Group by level
        const levels = new Map<number, PositionedNode[]>();
        positions.forEach(pos => {
            if (!levels.has(pos.level)) {
                levels.set(pos.level, []);
            }
            levels.get(pos.level)!.push(pos);
        });
        
        // Check each level for overlaps
        levels.forEach(levelNodes => {
            // Sort by X position
            levelNodes.sort((a, b) => a.x - b.x);
            
            // Adjust positions if overlapping
            for (let i = 1; i < levelNodes.length; i++) {
                const prev = levelNodes[i - 1];
                const curr = levelNodes[i];
                
                const minX = prev.x + nodeWidth + minSpacing;
                if (curr.x < minX) {
                    curr.x = minX;
                }
            }
        });
    }
}
