/**
 * Vertical layout engine (top-to-bottom)
 * Classic layered layout with centered nodes
 */

import { FlowchartData, LayoutConfig, LayoutResult, PositionedNode } from '../core/types';
import { LayoutEngine, assignLevelsBFS, groupByLevel, calculateBounds } from './base';

export class VerticalLayout implements LayoutEngine {
    layout(data: FlowchartData, config: LayoutConfig): LayoutResult {
        const { nodeWidth, nodeHeight, verticalSpacing, horizontalSpacing, padding } = config;
        
        // Assign levels using BFS
        const levels = assignLevelsBFS(data);
        const levelGroups = groupByLevel(data, levels);
        
        // Find maximum layer width for centering
        let maxLayerWidth = 0;
        levelGroups.forEach(nodes => {
            const layerWidth = nodes.length * nodeWidth + (nodes.length - 1) * horizontalSpacing;
            maxLayerWidth = Math.max(maxLayerWidth, layerWidth);
        });
        
        // Position nodes with centering
        const positions: PositionedNode[] = [];
        
        levelGroups.forEach((nodes, level) => {
            const layerWidth = nodes.length * nodeWidth + (nodes.length - 1) * horizontalSpacing;
            const startX = padding + (maxLayerWidth - layerWidth) / 2;
            
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
