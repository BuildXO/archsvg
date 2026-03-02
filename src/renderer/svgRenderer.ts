/**
 * Modular SVG renderer
 * Generates SVG markup from layout, routing, and theme data
 */

import { Theme, TypographyConfig, EdgePath, PositionedNode, LayoutMode } from '../core/types';

// ============================================================================
// SVG RENDERER
// ============================================================================

export class SvgRenderer {
    /**
     * Render complete SVG diagram
     */
    render(
        positions: PositionedNode[],
        edgePaths: EdgePath[],
        width: number,
        height: number,
        nodeWidth: number,
        nodeHeight: number,
        theme: Theme,
        typography: TypographyConfig,
        includeBackground: boolean,
        layoutMode: LayoutMode
    ): string {
        let svg = this.createSvgRoot(width, height);
        svg += this.createDefs(theme, includeBackground);

        // Background
        if (includeBackground) {
            svg += this.renderBackground(width, height, theme);
        }

        // Edges (draw first, behind nodes)
        svg += this.renderEdges(edgePaths, theme);

        // Nodes
        svg += this.renderNodes(positions, nodeWidth, nodeHeight, theme, typography);

        svg += '</svg>';
        return svg;
    }

    /**
     * Create SVG root element
     */
    private createSvgRoot(width: number, height: number): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
    }

    /**
     * Create SVG definitions (markers, filters, patterns)
     */
    private createDefs(theme: Theme, includeBackground: boolean): string {
        let defs = '  <defs>\n';

        // Arrowhead marker
        defs += `    <marker id="arrowhead" markerWidth="${theme.edgeStyle.arrowheadSize}" markerHeight="${theme.edgeStyle.arrowheadSize}" refX="${theme.edgeStyle.arrowheadSize - 1}" refY="${theme.edgeStyle.arrowheadSize / 2}" orient="auto" markerUnits="strokeWidth">\n`;
        defs += `      <path d="M 0 0 L ${theme.edgeStyle.arrowheadSize} ${theme.edgeStyle.arrowheadSize / 2} L 0 ${theme.edgeStyle.arrowheadSize} z" fill="${theme.colors.edgeArrowhead}" />\n`;
        defs += '    </marker>\n';

        // Shadow filter (if enabled)
        if (theme.nodeStyle.shadowEnabled) {
            defs += '    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">\n';
            defs += '      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>\n';
            defs += '      <feOffset dx="0" dy="1" result="offsetblur"/>\n';
            defs += '      <feComponentTransfer>\n';
            defs += '        <feFuncA type="linear" slope="0.2"/>\n';
            defs += '      </feComponentTransfer>\n';
            defs += '      <feMerge>\n';
            defs += '        <feMergeNode/>\n';
            defs += '        <feMergeNode in="SourceGraphic"/>\n';
            defs += '      </feMerge>\n';
            defs += '    </filter>\n';
        }

        // Grid pattern (if background enabled and grid color defined)
        if (includeBackground && theme.colors.gridPattern) {
            defs += '    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">\n';
            defs += `      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${theme.colors.gridPattern}" stroke-width="0.5"/>\n`;
            defs += '    </pattern>\n';
        }

        defs += '  </defs>\n\n';
        return defs;
    }

    /**
     * Render background
     */
    private renderBackground(width: number, height: number, theme: Theme): string {
        let bg = `  <rect width="${width}" height="${height}" fill="${theme.colors.background}"/>\n`;

        if (theme.colors.gridPattern) {
            bg += `  <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.5"/>\n`;
        }

        return bg + '\n';
    }

    /**
     * Render all edges
     */
    private renderEdges(edgePaths: EdgePath[], theme: Theme): string {
        let svg = '  <!-- Edges -->\n';

        for (const { path } of edgePaths) {
            svg += `  <path d="${path}" stroke="${theme.colors.edgeStroke}" stroke-width="${theme.edgeStyle.strokeWidth}" fill="none" marker-end="url(#arrowhead)" />\n`;
        }

        svg += '\n';
        return svg;
    }

    /**
     * Render all nodes
     */
    private renderNodes(
        positions: PositionedNode[],
        nodeWidth: number,
        nodeHeight: number,
        theme: Theme,
        typography: TypographyConfig
    ): string {
        let svg = '  <!-- Nodes -->\n';

        for (const { node, x, y } of positions) {
            // Node container with optional shadow
            if (theme.nodeStyle.shadowEnabled) {
                svg += '  <g filter="url(#shadow)">\n';
                svg += `    <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="${theme.nodeStyle.borderRadius}" fill="${theme.colors.nodeFill}" stroke="${theme.colors.nodeStroke}" stroke-width="${theme.nodeStyle.strokeWidth}" />\n`;
                svg += '  </g>\n';
            } else {
                svg += `  <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="${theme.nodeStyle.borderRadius}" fill="${theme.colors.nodeFill}" stroke="${theme.colors.nodeStroke}" stroke-width="${theme.nodeStyle.strokeWidth}" />\n`;
            }

            // Node label
            const textX = x + nodeWidth / 2;
            const textY = y + nodeHeight / 2 + 1;

            const fontProps = this.buildFontProperties(typography, theme.colors.nodeText);

            svg += `  <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle" ${fontProps}>${this.escapeXml(node.label)}</text>\n`;
        }

        return svg;
    }

    /**
     * Build font property string from typography config
     */
    private buildFontProperties(typography: TypographyConfig, color: string): string {
        const props: string[] = [];

        props.push(`fill="${color}"`);
        props.push(`font-size="${typography.fontSize}"`);
        props.push(`font-weight="${typography.fontWeight}"`);
        props.push(`font-family="${typography.fontFamily}"`);

        if (typography.letterSpacing !== undefined) {
            props.push(`letter-spacing="${typography.letterSpacing}"`);
        }

        return props.join(' ');
    }

    /**
     * Escape XML special characters
     */
    private escapeXml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}
