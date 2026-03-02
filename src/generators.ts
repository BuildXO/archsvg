/**
 * Core generators for SVG asset creation
 * Extensible for future AI provider integration
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface AssetGenerator {
    generate(prompt: string): Promise<string>;
}

export interface FlowchartNode {
    id: string;
    label: string;
}

export interface FlowchartEdge {
    from: string;
    to: string;
}

export interface FlowchartData {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
}

// ============================================================================
// BASIC SVG ICON GENERATOR
// ============================================================================

/**
 * Generates simple geometric icons using keyword mapping
 */
export class BasicSvgIconGenerator implements AssetGenerator {
    constructor(
        private primaryColor: string = '#3498db',
        private secondaryColor: string = '#2ecc71'
    ) {}

    async generate(prompt: string): Promise<string> {
        const normalized = prompt.toLowerCase().trim();

        // Keyword-based icon mapping
        if (normalized.includes('check') || normalized.includes('tick') || normalized.includes('success')) {
            return this.checkIcon();
        } else if (normalized.includes('close') || normalized.includes('x') || normalized.includes('cancel')) {
            return this.closeIcon();
        } else if (normalized.includes('warning') || normalized.includes('alert')) {
            return this.warningIcon();
        } else if (normalized.includes('info') || normalized.includes('information')) {
            return this.infoIcon();
        } else if (normalized.includes('star') || normalized.includes('favorite')) {
            return this.starIcon();
        } else if (normalized.includes('heart') || normalized.includes('love')) {
            return this.heartIcon();
        } else if (normalized.includes('gear') || normalized.includes('settings')) {
            return this.gearIcon();
        } else if (normalized.includes('folder') || normalized.includes('directory')) {
            return this.folderIcon();
        } else if (normalized.includes('file') || normalized.includes('document')) {
            return this.fileIcon();
        } else if (normalized.includes('user') || normalized.includes('person') || normalized.includes('profile')) {
            return this.userIcon();
        }
        
        // Smart fallback: Generate initial-based icon
        return this.initialIcon(prompt);
    }

    private checkIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
  <path d="M9 12l2 2 4-4" stroke="${this.primaryColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    }

    private closeIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
  <path d="M8 8l8 8M16 8l-8 8" stroke="${this.primaryColor}" stroke-width="2" stroke-linecap="round"/>
</svg>`;
    }

    private warningIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2L2 20h20L12 2z" fill="${this.primaryColor}" opacity="0.2"/>
  <path d="M12 2L2 20h20L12 2z" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
  <line x1="12" y1="9" x2="12" y2="13" stroke="${this.primaryColor}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="16" r="1" fill="${this.primaryColor}"/>
</svg>`;
    }

    private infoIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="${this.primaryColor}" opacity="0.2"/>
  <circle cx="12" cy="12" r="10" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
  <circle cx="12" cy="8" r="1" fill="${this.primaryColor}"/>
  <line x1="12" y1="11" x2="12" y2="16" stroke="${this.primaryColor}" stroke-width="2" stroke-linecap="round"/>
</svg>`;
    }

    private starIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1z" fill="${this.primaryColor}" opacity="0.8"/>
  <path d="M12 2l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1z" stroke="${this.primaryColor}" stroke-width="1" fill="none"/>
</svg>`;
    }

    private heartIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.36 3 12 4 12 4C12 4 13.64 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" fill="${this.primaryColor}" opacity="0.8"/>
  <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.36 3 12 4 12 4C12 4 13.64 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" stroke="${this.primaryColor}" stroke-width="1" fill="none"/>
</svg>`;
    }

    private gearIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="${this.primaryColor}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="3" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
</svg>`;
    }

    private folderIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M3 7v12h18V7H12L10 5H3z" fill="${this.primaryColor}" opacity="0.3"/>
  <path d="M3 7v12h18V7H12L10 5H3z" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
</svg>`;
    }

    private fileIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M6 2h8l6 6v14H6V2z" fill="currentColor" opacity="0.2"/>
  <path d="M6 2h8l6 6v14H6V2z" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
  <path d="M14 2v6h6" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
</svg>`;
    }

    private userIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="8" r="4" fill="${this.primaryColor}" opacity="0.3"/>
  <circle cx="12" cy="8" r="4" stroke="${this.primaryColor}" stroke-width="2" fill="none"/>
  <path d="M4 20c0-4 3-7 8-7s8 3 8 7" stroke="${this.primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;
    }

    /**
     * Smart fallback: Generates initial-based icon for unknown keywords
     * Creates a rounded square with the first letter of the prompt
     */
    private initialIcon(prompt: string): string {
        // Extract first letter and uppercase it
        const initial = prompt.trim()[0]?.toUpperCase() || '?';
        
        // Use a gradient for better visual appeal
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${this.primaryColor};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${this.secondaryColor};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#grad)"/>
  <rect x="3" y="3" width="18" height="18" rx="4" stroke="${this.primaryColor}" stroke-width="1.5" fill="none"/>
  <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif">${this.escapeXml(initial)}</text>
</svg>`;
    }

    private escapeXml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}

// ============================================================================
// BASIC FLOWCHART GENERATOR
// ============================================================================

/**
 * Generates simple SVG flowcharts from JSON with vertical layout
 */
export class BasicFlowchartGenerator implements AssetGenerator {
    constructor(
        private primaryColor: string = '#3498db',
        private secondaryColor: string = '#2ecc71'
    ) {}

    async generate(prompt: string): Promise<string> {
        try {
            const data: FlowchartData = JSON.parse(prompt);
            return this.generateFlowchart(data);
        } catch (error) {
            throw new Error('Invalid JSON format. Expected: { "nodes": [...], "edges": [...] }');
        }
    }

    private generateFlowchart(data: FlowchartData): string {
        // Configuration for professional layout
        const nodeWidth = 140;
        const nodeHeight = 50;
        const verticalSpacing = 80;
        const horizontalSpacing = 60;
        const padding = 40;

        const layout = this.calculateLayout(data, nodeWidth, nodeHeight, verticalSpacing, horizontalSpacing);

        // Calculate diagram bounds with proper centering
        const maxX = Math.max(...layout.map(l => l.x));
        const maxY = Math.max(...layout.map(l => l.y));
        const width = maxX + nodeWidth + padding * 2;
        const height = maxY + nodeHeight + padding * 2;

        // Professional SVG with modern styling
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Modern arrowhead marker -->
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#64748b" />
    </marker>
    
    <!-- Subtle node shadow -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="1" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background grid pattern (subtle) -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5"/>
\n`;

        // Draw orthogonal edges first (behind nodes)
        for (const edge of data.edges) {
            const fromNode = layout.find(l => l.node.id === edge.from);
            const toNode = layout.find(l => l.node.id === edge.to);

            if (fromNode && toNode) {
                const path = this.createOrthogonalPath(
                    fromNode.x, fromNode.y,
                    toNode.x, toNode.y,
                    nodeWidth, nodeHeight
                );
                svg += `  <path d="${path}" stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />\n`;
            }
        }

        // Draw nodes with modern styling
        for (const item of layout) {
            const { node, x, y } = item;
            
            // Node container with shadow
            svg += `  <g filter="url(#shadow)">\n`;
            svg += `    <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />\n`;
            svg += `  </g>\n`;
            
            // Node label with proper typography
            svg += `  <text x="${x + nodeWidth / 2}" y="${y + nodeHeight / 2 + 1}" text-anchor="middle" dominant-baseline="middle" fill="#1e293b" font-size="13" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${this.escapeXml(node.label)}</text>\n`;
        }

        svg += '</svg>';
        return svg;
    }

    /**
     * Create orthogonal (L-shaped) path between nodes
     * Professional connector routing with vertical-horizontal-vertical segments
     */
    private createOrthogonalPath(
        fromX: number, fromY: number,
        toX: number, toY: number,
        nodeWidth: number, nodeHeight: number
    ): string {
        // Calculate connection points (center of nodes)
        const startX = fromX + nodeWidth / 2;
        const startY = fromY + nodeHeight; // Bottom of source node
        const endX = toX + nodeWidth / 2;
        const endY = toY; // Top of target node

        // Calculate midpoint for the horizontal segment
        const midY = startY + (endY - startY) / 2;

        // Build orthogonal path: down → across → down
        const path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY - 8}`;
        
        return path;
    }

    /**
     * Calculate improved layered layout with proper centering
     * Uses BFS for level assignment and centers each layer horizontally
     */
    private calculateLayout(data: FlowchartData, nodeWidth: number, nodeHeight: number, verticalSpacing: number, horizontalSpacing: number) {
        const layout: Array<{ node: FlowchartNode; x: number; y: number }> = [];
        const levels: Map<string, number> = new Map();

        // BFS level assignment
        const visited = new Set<string>();
        const queue: Array<{ id: string; level: number }> = [];

        const hasIncoming = new Set(data.edges.map(e => e.to));
        const roots = data.nodes.filter(n => !hasIncoming.has(n.id));

        if (roots.length === 0 && data.nodes.length > 0) {
            roots.push(data.nodes[0]);
        }

        roots.forEach(root => queue.push({ id: root.id, level: 0 }));

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current.id)) {
                continue;
            }

            visited.add(current.id);
            levels.set(current.id, current.level);

            const outgoing = data.edges.filter(e => e.from === current.id);
            outgoing.forEach(edge => {
                if (!visited.has(edge.to)) {
                    queue.push({ id: edge.to, level: current.level + 1 });
                }
            });
        }

        // Assign positions for unvisited nodes
        data.nodes.forEach(node => {
            if (!levels.has(node.id)) {
                levels.set(node.id, 0);
            }
        });

        // Group nodes by level
        const levelGroups: Map<number, FlowchartNode[]> = new Map();
        data.nodes.forEach(node => {
            const level = levels.get(node.id)!;
            if (!levelGroups.has(level)) {
                levelGroups.set(level, []);
            }
            levelGroups.get(level)!.push(node);
        });

        // Find the maximum width needed (widest layer)
        let maxLayerWidth = 0;
        levelGroups.forEach(nodes => {
            const layerWidth = nodes.length * nodeWidth + (nodes.length - 1) * horizontalSpacing;
            maxLayerWidth = Math.max(maxLayerWidth, layerWidth);
        });

        // Calculate positions with proper centering
        const padding = 40;
        levelGroups.forEach((nodes, level) => {
            // Calculate width of this layer
            const layerWidth = nodes.length * nodeWidth + (nodes.length - 1) * horizontalSpacing;
            
            // Center this layer relative to the maximum width
            const startX = padding + (maxLayerWidth - layerWidth) / 2;
            
            nodes.forEach((node, index) => {
                const x = startX + index * (nodeWidth + horizontalSpacing);
                const y = padding + level * (nodeHeight + verticalSpacing);
                layout.push({ node, x, y });
            });
        });

        return layout;
    }

    private escapeXml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}

// ============================================================================
// PHASE 2: ADVANCED FLOWCHART GENERATOR
// ============================================================================

// Re-export Phase 2 modules for easy access
export { AdvancedFlowchartGenerator, generateFlowchart as generateAdvancedFlowchart, generateWithLayout, generateWithTheme } from './core/advancedGenerator';
export { getLayoutEngine, getAvailableLayoutModes } from './layout';
export { getTheme, getThemeNames, THEMES } from './themes/presets';
export { getTypography, getTypographyPresetNames } from './typography/presets';
export { WIDTH_PRESETS } from './export/svgExporter';
export type { DiagramConfig, LayoutMode, Theme, TypographyConfig } from './core/types';
