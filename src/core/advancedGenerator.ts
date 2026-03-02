/**
 * Advanced Flowchart Generator (Phase 2)
 * Integrates layout engines, routing, themes, and export controls
 */

import { FlowchartData, DiagramConfig, LayoutConfig, LayoutMode } from '../core/types';
import { getLayoutEngine } from '../layout';
import { EdgeRouter, getDefaultRoutingConfig } from '../routing/edgeRouter';
import { SvgRenderer } from '../renderer/svgRenderer';
import { SvgExporter, getDefaultExportConfig } from '../export/svgExporter';
import { DEFAULT_THEME } from '../themes/presets';
import { DEFAULT_TYPOGRAPHY } from '../typography/presets';

// ============================================================================
// CONFIGURATION DEFAULTS
// ============================================================================

export function getDefaultLayoutConfig(): LayoutConfig {
    return {
        nodeWidth: 140,
        nodeHeight: 50,
        verticalSpacing: 80,
        horizontalSpacing: 60,
        padding: 40
    };
}

export function getDefaultDiagramConfig(): DiagramConfig {
    return {
        layout: getDefaultLayoutConfig(),
        layoutMode: 'vertical',
        routing: getDefaultRoutingConfig(),
        theme: DEFAULT_THEME,
        typography: DEFAULT_TYPOGRAPHY,
        export: getDefaultExportConfig()
    };
}

// ============================================================================
// ADVANCED FLOWCHART GENERATOR
// ============================================================================

export class AdvancedFlowchartGenerator {
    private config: DiagramConfig;

    constructor(config: Partial<DiagramConfig> = {}) {
        this.config = {
            ...getDefaultDiagramConfig(),
            ...config,
            layout: { ...getDefaultLayoutConfig(), ...(config.layout || {}) },
            routing: { ...getDefaultRoutingConfig(), ...(config.routing || {}) },
            theme: { ...DEFAULT_THEME, ...(config.theme || {}) },
            typography: { ...DEFAULT_TYPOGRAPHY, ...(config.typography || {}) },
            export: { ...getDefaultExportConfig(), ...(config.export || {}) }
        };
    }

    /**
     * Generate SVG flowchart from data
     */
    generate(data: FlowchartData): string {
        // 1. Layout calculation
        const layoutEngine = getLayoutEngine(this.config.layoutMode);
        const layoutResult = layoutEngine.layout(data, this.config.layout);

        // 2. Edge routing
        const router = new EdgeRouter(this.config.routing);
        const edgePaths = router.routeEdges(
            data,
            layoutResult.nodes,
            this.config.layout.nodeWidth,
            this.config.layout.nodeHeight,
            this.config.layoutMode
        );

        // 3. SVG rendering
        const renderer = new SvgRenderer();
        const svg = renderer.render(
            layoutResult.nodes,
            edgePaths,
            layoutResult.width,
            layoutResult.height,
            this.config.layout.nodeWidth,
            this.config.layout.nodeHeight,
            this.config.theme,
            this.config.typography,
            this.config.export.includeBackground,
            this.config.layoutMode
        );

        // 4. Export processing
        const exporter = new SvgExporter();
        const processed = exporter.process(svg, this.config.export);

        return processed;
    }

    /**
     * Update configuration
     */
    updateConfig(updates: Partial<DiagramConfig>): void {
        this.config = {
            ...this.config,
            ...updates,
            layout: { ...this.config.layout, ...(updates.layout || {}) },
            routing: { ...this.config.routing, ...(updates.routing || {}) },
            theme: { ...this.config.theme, ...(updates.theme || {}) },
            typography: { ...this.config.typography, ...(updates.typography || {}) },
            export: { ...this.config.export, ...(updates.export || {}) }
        };
    }

    /**
     * Get current configuration
     */
    getConfig(): DiagramConfig {
        return { ...this.config };
    }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick generate with default configuration
 */
export function generateFlowchart(data: FlowchartData): string {
    const generator = new AdvancedFlowchartGenerator();
    return generator.generate(data);
}

/**
 * Generate with specific layout mode
 */
export function generateWithLayout(data: FlowchartData, layoutMode: LayoutMode): string {
    const generator = new AdvancedFlowchartGenerator({ layoutMode });
    return generator.generate(data);
}

/**
 * Generate with specific theme
 */
export function generateWithTheme(data: FlowchartData, themeName: string): string {
    const { getTheme } = require('../themes/presets');
    const theme = getTheme(themeName);
    const generator = new AdvancedFlowchartGenerator({ theme });
    return generator.generate(data);
}
