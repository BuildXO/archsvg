/**
 * Base layout engine interface and shared utilities
 * Provides strategy pattern for different layout algorithms
 */

import { FlowchartData, LayoutConfig, LayoutResult, PositionedNode, FlowchartNode } from '../core/types';

// ============================================================================
// LAYOUT ENGINE INTERFACE
// ============================================================================

export interface LayoutEngine {
    /**
     * Calculate positions for all nodes in the flowchart
     * @param data The flowchart data (nodes and edges)
     * @param config Layout configuration (spacing, dimensions, etc.)
     * @returns Positioned nodes and diagram dimensions
     */
    layout(data: FlowchartData, config: LayoutConfig): LayoutResult;
}

// ============================================================================
// SHARED LAYOUT UTILITIES
// ============================================================================

/**
 * Build adjacency list from edges for graph traversal
 */
export function buildAdjacencyList(data: FlowchartData): Map<string, string[]> {
    const adj = new Map<string, string[]>();
    
    // Initialize all nodes
    data.nodes.forEach(node => {
        adj.set(node.id, []);
    });
    
    // Add edges
    data.edges.forEach(edge => {
        const neighbors = adj.get(edge.from) || [];
        neighbors.push(edge.to);
        adj.set(edge.from, neighbors);
    });
    
    return adj;
}

/**
 * Find root nodes (nodes with no incoming edges)
 */
export function findRootNodes(data: FlowchartData): FlowchartNode[] {
    const hasIncoming = new Set(data.edges.map(e => e.to));
    const roots = data.nodes.filter(n => !hasIncoming.has(n.id));
    
    // Fallback: if no clear roots, use first node
    if (roots.length === 0 && data.nodes.length > 0) {
        return [data.nodes[0]];
    }
    
    return roots;
}

/**
 * Assign levels to nodes using BFS (Breadth-First Search)
 * Returns a map of node ID to level number
 */
export function assignLevelsBFS(data: FlowchartData): Map<string, number> {
    const levels = new Map<string, number>();
    const visited = new Set<string>();
    const queue: Array<{ id: string; level: number }> = [];
    
    const roots = findRootNodes(data);
    roots.forEach(root => queue.push({ id: root.id, level: 0 }));
    
    while (queue.length > 0) {
        const current = queue.shift()!;
        
        if (visited.has(current.id)) {
            continue;
        }
        
        visited.add(current.id);
        levels.set(current.id, current.level);
        
        // Add children to queue
        const outgoing = data.edges.filter(e => e.from === current.id);
        outgoing.forEach(edge => {
            if (!visited.has(edge.to)) {
                queue.push({ id: edge.to, level: current.level + 1 });
            }
        });
    }
    
    // Assign level 0 to any unvisited nodes
    data.nodes.forEach(node => {
        if (!levels.has(node.id)) {
            levels.set(node.id, 0);
        }
    });
    
    return levels;
}

/**
 * Group nodes by their level
 */
export function groupByLevel(data: FlowchartData, levels: Map<string, number>): Map<number, FlowchartNode[]> {
    const groups = new Map<number, FlowchartNode[]>();
    
    data.nodes.forEach(node => {
        const level = levels.get(node.id)!;
        if (!groups.has(level)) {
            groups.set(level, []);
        }
        groups.get(level)!.push(node);
    });
    
    return groups;
}

/**
 * Calculate diagram bounds from positioned nodes
 */
export function calculateBounds(
    positions: PositionedNode[],
    nodeWidth: number,
    nodeHeight: number,
    padding: number
): { width: number; height: number } {
    if (positions.length === 0) {
        return { width: padding * 2, height: padding * 2 };
    }
    
    const maxX = Math.max(...positions.map(p => p.x));
    const maxY = Math.max(...positions.map(p => p.y));
    
    return {
        width: maxX + nodeWidth + padding * 2,
        height: maxY + nodeHeight + padding * 2
    };
}
