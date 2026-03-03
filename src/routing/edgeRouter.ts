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

        // Group edges by source node to detect divergence
        const edgesBySource = new Map<string, Array<{ edge: any; fromNode: PositionedNode; toNode: PositionedNode }>>();
        
        // Group edges by target node to detect convergence
        const edgesByTarget = new Map<string, Array<{ edge: any; fromNode: PositionedNode; toNode: PositionedNode }>>();
        
        for (const edge of data.edges) {
            const fromNode = positions.find(p => p.node.id === edge.from);
            const toNode = positions.find(p => p.node.id === edge.to);

            if (fromNode && toNode) {
                const edgeInfo = { edge, fromNode, toNode };
                
                if (!edgesBySource.has(edge.from)) {
                    edgesBySource.set(edge.from, []);
                }
                edgesBySource.get(edge.from)!.push(edgeInfo);
                
                if (!edgesByTarget.has(edge.to)) {
                    edgesByTarget.set(edge.to, []);
                }
                edgesByTarget.get(edge.to)!.push(edgeInfo);
            }
        }

        // Create index maps for divergence and convergence
        const divergenceIndex = new Map<string, number>();
        const convergenceIndex = new Map<string, number>();
        
        // Calculate indices for each edge
        for (const [sourceId, edges] of edgesBySource) {
            edges.forEach((edgeInfo, idx) => {
                const key = `${edgeInfo.edge.from}-${edgeInfo.edge.to}`;
                divergenceIndex.set(key, idx);
            });
        }
        
        for (const [targetId, edges] of edgesByTarget) {
            edges.forEach((edgeInfo, idx) => {
                const key = `${edgeInfo.edge.from}-${edgeInfo.edge.to}`;
                convergenceIndex.set(key, idx);
            });
        }

        // Route all edges
        for (const edge of data.edges) {
            const fromNode = positions.find(p => p.node.id === edge.from);
            const toNode = positions.find(p => p.node.id === edge.to);

            if (fromNode && toNode) {
                const key = `${edge.from}-${edge.to}`;
                const sourceEdges = edgesBySource.get(edge.from)!;
                const targetEdges = edgesByTarget.get(edge.to)!;
                
                const divergenceInfo = sourceEdges.length > 1 
                    ? { total: sourceEdges.length, index: divergenceIndex.get(key)! }
                    : undefined;
                    
                const convergenceInfo = targetEdges.length > 1
                    ? { total: targetEdges.length, index: convergenceIndex.get(key)! }
                    : undefined;
                
                let path: string;

                // Route based on layout mode
                if (layoutMode === 'horizontal') {
                    path = this.createHorizontalPath(fromNode, toNode, nodeWidth, nodeHeight, divergenceInfo, convergenceInfo);
                } else {
                    path = this.createVerticalPath(fromNode, toNode, nodeWidth, nodeHeight, divergenceInfo, convergenceInfo);
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
        nodeHeight: number,
        divergenceInfo?: { total: number; index: number },
        convergenceInfo?: { total: number; index: number }
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
                let startY = fromNode.y + nodeHeight / 2; // Middle of source
                const endX = toNode.x; // Left side of target
                let endY = toNode.y + nodeHeight / 2; // Middle of target
                
                // Apply vertical distribution for same-level edges
                if (divergenceInfo && divergenceInfo.total > 1) {
                    const spreadRange = nodeHeight * 0.6;
                    const step = spreadRange / (divergenceInfo.total - 1);
                    const offset = (divergenceInfo.index * step) - (spreadRange / 2);
                    startY += offset;
                }
                
                if (convergenceInfo && convergenceInfo.total > 1) {
                    const spreadRange = nodeHeight * 0.6;
                    const step = spreadRange / (convergenceInfo.total - 1);
                    const offset = (convergenceInfo.index * step) - (spreadRange / 2);
                    endY += offset;
                }
                
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
                let startY = fromNode.y + nodeHeight / 2;
                const endX = toNode.x + nodeWidth; // Right side of target
                let endY = toNode.y + nodeHeight / 2;
                
                // Apply vertical distribution for backward edges
                if (divergenceInfo && divergenceInfo.total > 1) {
                    const spreadRange = nodeHeight * 0.6;
                    const step = spreadRange / (divergenceInfo.total - 1);
                    const offset = (divergenceInfo.index * step) - (spreadRange / 2);
                    startY += offset;
                }
                
                if (convergenceInfo && convergenceInfo.total > 1) {
                    const spreadRange = nodeHeight * 0.6;
                    const step = spreadRange / (convergenceInfo.total - 1);
                    const offset = (convergenceInfo.index * step) - (spreadRange / 2);
                    endY += offset;
                }
                
                // Route around: go left, then up/down, then right
                const clearance = 30;
                const leftX = Math.min(startX, endX) - clearance;
                
                return `M ${startX} ${startY} L ${leftX} ${startY} L ${leftX} ${endY} L ${endX + 8} ${endY}`;
            }
        }

        // Connection points for standard vertical routing
        let startX = fromNode.x + nodeWidth / 2;
        const startY = fromNode.y + nodeHeight; // Bottom of source
        let endX = toNode.x + nodeWidth / 2;
        const endY = toNode.y; // Top of target

        // Distribute departure points for diverging edges (horizontally)
        if (divergenceInfo && divergenceInfo.total > 1) {
            const spreadRange = nodeWidth * 0.6; // Use 60% of node width
            const step = spreadRange / (divergenceInfo.total - 1);
            const offset = (divergenceInfo.index * step) - (spreadRange / 2);
            startX += offset;
        }

        // Distribute arrival points for converging edges (horizontally)
        if (convergenceInfo && convergenceInfo.total > 1) {
            const spreadRange = nodeWidth * 0.6; // Use 60% of node width
            const step = spreadRange / (convergenceInfo.total - 1);
            const offset = (convergenceInfo.index * step) - (spreadRange / 2);
            endX += offset;
        }

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
        nodeHeight: number,
        divergenceInfo?: { total: number; index: number },
        convergenceInfo?: { total: number; index: number }
    ): string {
        const { verticalGap } = this.config;

        // Connection points
        const startX = fromNode.x + nodeWidth; // Right of source
        let startY = fromNode.y + nodeHeight / 2;
        const endX = toNode.x; // Left of target
        let endY = toNode.y + nodeHeight / 2;

        // Distribute departure points for diverging edges
        if (divergenceInfo && divergenceInfo.total > 1) {
            const spreadRange = nodeHeight * 0.6; // Use 60% of node height
            const step = spreadRange / (divergenceInfo.total - 1);
            const offset = (divergenceInfo.index * step) - (spreadRange / 2);
            startY += offset;
        }

        // Distribute arrival points for converging edges
        if (convergenceInfo && convergenceInfo.total > 1) {
            const spreadRange = nodeHeight * 0.6; // Use 60% of node height
            const step = spreadRange / (convergenceInfo.total - 1);
            const offset = (convergenceInfo.index * step) - (spreadRange / 2);
            endY += offset;
        }

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
