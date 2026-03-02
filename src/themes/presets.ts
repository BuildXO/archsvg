/**
 * Professional theme presets for flowchart diagrams
 * Provides curated color schemes and styling options
 */

import { Theme } from '../core/types';

// ============================================================================
// THEME PRESETS
// ============================================================================

export const GITHUB_LIGHT: Theme = {
    name: 'GitHub Light',
    colors: {
        background: '#ffffff',
        nodeFill: '#f6f8fa',
        nodeStroke: '#d0d7de',
        nodeText: '#24292f',
        edgeStroke: '#57606a',
        edgeArrowhead: '#57606a',
        gridPattern: '#eaeef2'
    },
    nodeStyle: {
        strokeWidth: 1.5,
        borderRadius: 6,
        shadowEnabled: true
    },
    edgeStyle: {
        strokeWidth: 2,
        arrowheadSize: 8
    }
};

export const GITHUB_DARK: Theme = {
    name: 'GitHub Dark',
    colors: {
        background: '#0d1117',
        nodeFill: '#161b22',
        nodeStroke: '#30363d',
        nodeText: '#c9d1d9',
        edgeStroke: '#8b949e',
        edgeArrowhead: '#8b949e',
        gridPattern: '#21262d'
    },
    nodeStyle: {
        strokeWidth: 1.5,
        borderRadius: 6,
        shadowEnabled: false
    },
    edgeStyle: {
        strokeWidth: 2,
        arrowheadSize: 8
    }
};

export const MINIMAL_MONO: Theme = {
    name: 'Minimal Mono',
    colors: {
        background: '#ffffff',
        nodeFill: '#ffffff',
        nodeStroke: '#000000',
        nodeText: '#000000',
        edgeStroke: '#000000',
        edgeArrowhead: '#000000',
        gridPattern: undefined
    },
    nodeStyle: {
        strokeWidth: 2,
        borderRadius: 0,
        shadowEnabled: false
    },
    edgeStyle: {
        strokeWidth: 1.5,
        arrowheadSize: 7
    }
};

export const BLUEPRINT: Theme = {
    name: 'Blueprint',
    colors: {
        background: '#0c4a6e',
        nodeFill: 'rgba(255, 255, 255, 0.05)',
        nodeStroke: '#38bdf8',
        nodeText: '#e0f2fe',
        edgeStroke: '#7dd3fc',
        edgeArrowhead: '#7dd3fc',
        gridPattern: '#0e7490'
    },
    nodeStyle: {
        strokeWidth: 1.5,
        borderRadius: 2,
        shadowEnabled: false
    },
    edgeStyle: {
        strokeWidth: 1.5,
        arrowheadSize: 8
    }
};

// ============================================================================
// THEME REGISTRY
// ============================================================================

export const THEMES: Record<string, Theme> = {
    'github-light': GITHUB_LIGHT,
    'github-dark': GITHUB_DARK,
    'minimal-mono': MINIMAL_MONO,
    'blueprint': BLUEPRINT
};

export const DEFAULT_THEME = GITHUB_LIGHT;

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Get theme by name, fallback to default
 */
export function getTheme(name: string): Theme {
    return THEMES[name.toLowerCase()] || DEFAULT_THEME;
}

/**
 * List all available theme names
 */
export function getThemeNames(): string[] {
    return Object.keys(THEMES);
}

/**
 * Create custom theme by extending existing theme
 */
export function createCustomTheme(baseName: string, overrides: Partial<Theme>): Theme {
    const base = getTheme(baseName);
    return {
        ...base,
        ...overrides,
        colors: { ...base.colors, ...(overrides.colors || {}) },
        nodeStyle: { ...base.nodeStyle, ...(overrides.nodeStyle || {}) },
        edgeStyle: { ...base.edgeStyle, ...(overrides.edgeStyle || {}) }
    };
}
