/**
 * Compact Vertical layout engine
 * Tighter spacing, optimized for dense diagrams
 */

import { FlowchartData, LayoutConfig, LayoutResult, PositionedNode } from '../core/types';
import { LayoutEngine, assignLevelsBFS, groupByLevel, calculateBounds } from './base';

export class CompactVerticalLayout implements LayoutEngine {
    layout(data: FlowchartData, config: LayoutConfig): LayoutResult {
        // Reduce spacing for compact layout
        const compactConfig = {
            ...config,
            verticalSpacing: Math.floor(config.verticalSpacing * 0.6),
            horizontalSpacing: Math.floor(config.horizontalSpacing * 0.7),
            padding: Math.floor(config.padding * 0.75)
        };
        
        const { nodeWidth, nodeHeight, verticalSpacing, horizontalSpacing, padding } = compactConfig;
        
        // Assign levels using BFS
        const levels = assignLevelsBFS(data);
        const levelGroups = groupByLevel(data, levels);
        
        // Use minimal centering - keep layers tighter
        const positions: PositionedNode[] = [];
        
        levelGroups.forEach((nodes, level) => {
            // Start from left with minimal padding
            const startX = padding;
            
            nodes.forEach((node, index) => {
                const x = startX + index * (nodeWidth + horizontalSpacing);
                const y = padding + level * (nodeHeight + verticalSpacing);
                
                positions.push({ node, x, y, level });
            });
        });
        
        const bounds = calculateBounds(positions, nodeWidth, nodeHeight, padding);
        
        return {
            nodes: positions,
            ...bounds
        };
    }
}
