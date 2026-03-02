/**
 * Typography configuration and presets
 * Controls font styling for diagram text
 */

import { TypographyConfig } from '../core/types';

// ============================================================================
// TYPOGRAPHY PRESETS
// ============================================================================

export const SYSTEM_FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
export const MONOSPACE_FONT_STACK = '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace';
export const SERIF_FONT_STACK = 'Georgia, Cambria, "Times New Roman", Times, serif';

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
    fontFamily: SYSTEM_FONT_STACK,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0
};

export const COMPACT_TYPOGRAPHY: TypographyConfig = {
    fontFamily: SYSTEM_FONT_STACK,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 0
};

export const BOLD_TYPOGRAPHY: TypographyConfig = {
    fontFamily: SYSTEM_FONT_STACK,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.3
};

export const MONOSPACE_TYPOGRAPHY: TypographyConfig = {
    fontFamily: MONOSPACE_FONT_STACK,
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0
};

export const LARGE_TYPOGRAPHY: TypographyConfig = {
    fontFamily: SYSTEM_FONT_STACK,
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.2
};

// ============================================================================
// TYPOGRAPHY REGISTRY
// ============================================================================

export const TYPOGRAPHY_PRESETS: Record<string, TypographyConfig> = {
    default: DEFAULT_TYPOGRAPHY,
    compact: COMPACT_TYPOGRAPHY,
    bold: BOLD_TYPOGRAPHY,
    monospace: MONOSPACE_TYPOGRAPHY,
    large: LARGE_TYPOGRAPHY
};

// ============================================================================
// TYPOGRAPHY UTILITIES
// ============================================================================

/**
 * Get typography preset by name
 */
export function getTypography(name: string): TypographyConfig {
    return TYPOGRAPHY_PRESETS[name.toLowerCase()] || DEFAULT_TYPOGRAPHY;
}

/**
 * Create custom typography by extending preset
 */
export function createCustomTypography(
    baseName: string,
    overrides: Partial<TypographyConfig>
): TypographyConfig {
    const base = getTypography(baseName);
    return { ...base, ...overrides };
}

/**
 * List all available typography preset names
 */
export function getTypographyPresetNames(): string[] {
    return Object.keys(TYPOGRAPHY_PRESETS);
}
