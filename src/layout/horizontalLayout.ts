/**
 * Horizontal layout engine (left-to-right)
 * Rotates the classic vertical layout by 90 degrees
 */

import { FlowchartData, LayoutConfig, LayoutResult, PositionedNode } from '../core/types';
import { LayoutEngine, assignLevelsBFS, groupByLevel, calculateBounds } from './base';

export class HorizontalLayout implements LayoutEngine {
    layout(data: FlowchartData, config: LayoutConfig): LayoutResult {
        const { nodeWidth, nodeHeight, verticalSpacing, horizontalSpacing, padding } = config;
        
        // Assign levels using BFS (levels become columns)
        const levels = assignLevelsBFS(data);
        const levelGroups = groupByLevel(data, levels);
        
        // Find maximum column height for centering
        let maxColumnHeight = 0;
        levelGroups.forEach(nodes => {
            const columnHeight = nodes.length * nodeHeight + (nodes.length - 1) * horizontalSpacing;
            maxColumnHeight = Math.max(maxColumnHeight, columnHeight);
        });
        
        // Position nodes horizontally (swap X and Y logic)
        const positions: PositionedNode[] = [];
        
        levelGroups.forEach((nodes, level) => {
            const columnHeight = nodes.length * nodeHeight + (nodes.length - 1) * horizontalSpacing;
            const startY = padding + (maxColumnHeight - columnHeight) / 2;
            
            nodes.forEach((node, index) => {
                const x = padding + level * (nodeWidth + verticalSpacing); // Level determines X
                const y = startY + index * (nodeHeight + horizontalSpacing); // Index determines Y
                
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
