/**
 * Enhanced edge routing system
 * Provides improved orthogonal routing with node overlap avoidance
 */

import { FlowchartData, PositionedNode, RoutingConfig, EdgePath, LayoutMode } from '../core/types';

// ============================================================================
// ROUTING ENGINE
// ============================================================================

export class EdgeRouter {
    constructor(private config: RoutingConfig) {}

    /**
     * Calculate paths for all edges
     */
    routeEdges(
        data: FlowchartData,
        positions: PositionedNode[],
        nodeWidth: number,
        nodeHeight: number,
        layoutMode: LayoutMode
    ): EdgePath[] {
        const paths: EdgePath[] = [];

        for (const edge of data.edges) {
            const fromNode = positions.find(p => p.node.id === edge.from);
            const toNode = positions.find(p => p.node.id === edge.to);

            if (fromNode && toNode) {
                let path: string;

                // Route based on layout mode
                if (layoutMode === 'horizontal') {
                    path = this.createHorizontalPath(fromNode, toNode, nodeWidth, nodeHeight);
                } else {
                    path = this.createVerticalPath(fromNode, toNode, nodeWidth, nodeHeight);
                }

                paths.push({ edge, path, fromNode, toNode });
            }
        }

        return paths;
    }

    /**
     * Create orthogonal path for vertical layouts (top-to-bottom)
     * Uses adjustable vertical gap and improved merge routing
     */
    private createVerticalPath(
        fromNode: PositionedNode,
        toNode: PositionedNode,
        nodeWidth: number,
        nodeHeight: number
    ): string {
        const { verticalGap, balancedMerges } = this.config;

        // Check if nodes are at roughly the same level (same-level routing)
        const sameLevelThreshold = nodeHeight * 0.5; // Within half a node height
        const isSameLevel = Math.abs(fromNode.y - toNode.y) < sameLevelThreshold;

        if (isSameLevel) {
            // Route horizontally for same-level nodes
            const fromRight = fromNode.x < toNode.x;
            
            if (fromRight) {
                // From left node to right node
                const startX = fromNode.x + nodeWidth; // Right side of source
                const startY = fromNode.y + nodeHeight / 2; // Middle of source
                const endX = toNode.x; // Left side of target
                const endY = toNode.y + nodeHeight / 2; // Middle of target
                
                // Simple horizontal routing with optional vertical adjustment
                if (Math.abs(startY - endY) < 5) {
                    // Perfectly aligned horizontally
                    return `M ${startX} ${startY} L ${endX - 8} ${startY}`;
                } else {
                    // Need slight vertical adjustment
                    const midX = startX + (endX - startX) / 2;
                    return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX - 8} ${endY}`;
                }
            } else {
                // From right node to left node (backward connection)
                const startX = fromNode.x; // Left side of source
                const startY = fromNode.y + nodeHeight / 2;
                const endX = toNode.x + nodeWidth; // Right side of target
                const endY = toNode.y + nodeHeight / 2;
                
                // Route around: go left, then up/down, then right
                const clearance = 30;
                const leftX = Math.min(startX, endX) - clearance;
                
                return `M ${startX} ${startY} L ${leftX} ${startY} L ${leftX} ${endY} L ${endX + 8} ${endY}`;
            }
        }

        // Connection points for standard vertical routing
        const startX = fromNode.x + nodeWidth / 2;
        const startY = fromNode.y + nodeHeight; // Bottom of source
        const endX = toNode.x + nodeWidth / 2;
        const endY = toNode.y; // Top of target

        // Check if nodes are vertically aligned
        const isAligned = Math.abs(startX - endX) < 5;

        if (isAligned) {
            // Straight vertical line
            return `M ${startX} ${startY} L ${startX} ${endY - 8}`;
        }

        // Orthogonal routing with adjustable vertical gap
        const midY1 = startY + verticalGap;
        const midY2 = endY - verticalGap;

        if (balancedMerges && this.shouldUseBalancedMerge(fromNode, toNode)) {
            // Balanced merge: smoother transition for converging edges
            const mergeY = midY1 + (midY2 - midY1) / 2;
            return `M ${startX} ${startY} L ${startX} ${midY1} L ${startX} ${mergeY} L ${endX} ${mergeY} L ${endX} ${midY2} L ${endX} ${endY - 8}`;
        }

        // Standard orthogonal: down → across → down
        return `M ${startX} ${startY} L ${startX} ${midY1} L ${endX} ${midY1} L ${endX} ${endY - 8}`;
    }

    /**
     * Create orthogonal path for horizontal layouts (left-to-right)
     */
    private createHorizontalPath(
        fromNode: PositionedNode,
        toNode: PositionedNode,
        nodeWidth: number,
        nodeHeight: number
    ): string {
        const { verticalGap } = this.config;

        // Connection points
        const startX = fromNode.x + nodeWidth; // Right of source
        const startY = fromNode.y + nodeHeight / 2;
        const endX = toNode.x; // Left of target
        const endY = toNode.y + nodeHeight / 2;

        // Check if nodes are horizontally aligned
        const isAligned = Math.abs(startY - endY) < 5;

        if (isAligned) {
            // Straight horizontal line
            return `M ${startX} ${startY} L ${endX - 8} ${startY}`;
        }

        // Orthogonal routing: right → down/up → right
        const midX = startX + verticalGap;

        return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX - 8} ${endY}`;
    }

    /**
     * Determine if balanced merge routing should be used
     * Heuristic: multiple edges converging to the same target at significant angles
     */
    private shouldUseBalancedMerge(fromNode: PositionedNode, toNode: PositionedNode): boolean {
        const horizontalDistance = Math.abs(fromNode.x - toNode.x);
        const verticalDistance = Math.abs(fromNode.y - toNode.y);

        // Use balanced merge for diagonal connections
        return horizontalDistance > 100 && verticalDistance > 80;
    }
}

// ============================================================================
// ROUTING UTILITIES
// ============================================================================

/**
 * Check if a point is inside a node rectangle (for overlap detection)
 */
export function isPointInNode(
    x: number,
    y: number,
    nodeX: number,
    nodeY: number,
    nodeWidth: number,
    nodeHeight: number,
    clearance: number = 0
): boolean {
    return (
        x >= nodeX - clearance &&
        x <= nodeX + nodeWidth + clearance &&
        y >= nodeY - clearance &&
        y <= nodeY + nodeHeight + clearance
    );
}

/**
 * Get default routing configuration
 */
export function getDefaultRoutingConfig(): RoutingConfig {
    return {
        verticalGap: 20,
        nodeClearance: 10,
        balancedMerges: true
    };
}
