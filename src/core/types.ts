/**
 * Core type definitions for the SVG flowchart engine
 * Shared across layout, routing, rendering, and export modules
 */

// ============================================================================
// FLOWCHART DATA STRUCTURES
// ============================================================================

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
// LAYOUT TYPES
// ============================================================================

export type LayoutMode = 'vertical' | 'horizontal' | 'compact-vertical' | 'symmetric';

export interface LayoutConfig {
    nodeWidth: number;
    nodeHeight: number;
    verticalSpacing: number;
    horizontalSpacing: number;
    padding: number;
}

export interface PositionedNode {
    node: FlowchartNode;
    x: number;
    y: number;
    level: number;
}

export interface LayoutResult {
    nodes: PositionedNode[];
    width: number;
    height: number;
}

// ============================================================================
// ROUTING TYPES
// ============================================================================

export interface RoutingConfig {
    /** Vertical gap before horizontal segment (px) */
    verticalGap: number;
    /** Horizontal clearance around nodes (px) */
    nodeClearance: number;
    /** Enable balanced merge routing */
    balancedMerges: boolean;
}

export interface EdgePath {
    edge: FlowchartEdge;
    path: string;
    fromNode: PositionedNode;
    toNode: PositionedNode;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export interface ThemeColors {
    background: string;
    nodeFill: string;
    nodeStroke: string;
    nodeText: string;
    edgeStroke: string;
    edgeArrowhead: string;
    gridPattern?: string;
}

export interface Theme {
    name: string;
    colors: ThemeColors;
    nodeStyle: {
        strokeWidth: number;
        borderRadius: number;
        shadowEnabled: boolean;
    };
    edgeStyle: {
        strokeWidth: number;
        arrowheadSize: number;
    };
}

// ============================================================================
// TYPOGRAPHY TYPES
// ============================================================================

export interface TypographyConfig {
    fontFamily: string;
    fontSize: number;
    fontWeight: string | number;
    letterSpacing?: number;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportConfig {
    /** Canvas padding override (default uses layout padding) */
    canvasPadding?: number;
    /** Include background color/pattern */
    includeBackground: boolean;
    /** Width preset ('auto' uses calculated width) */
    widthPreset: number | 'auto';
    /** Minify SVG output (basic whitespace removal) */
    minify: boolean;
}

// ============================================================================
// UNIFIED CONFIGURATION
// ============================================================================

export interface DiagramConfig {
    layout: LayoutConfig;
    layoutMode: LayoutMode;
    routing: RoutingConfig;
    theme: Theme;
    typography: TypographyConfig;
    export: ExportConfig;
}
