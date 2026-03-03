/**
 * Export utilities for SVG processing
 * Provides canvas adjustment, minification, and width presets
 */

import { ExportConfig } from '../core/types';

// ============================================================================
// EXPORT PROCESSOR
// ============================================================================

export class SvgExporter {
    /**
     * Process exported SVG with configuration options
     */
    process(svg: string, config: ExportConfig): string {
        let processed = svg;

        // Apply width preset
        if (config.widthPreset !== 'auto') {
            processed = this.adjustWidth(processed, config.widthPreset);
        }

        // Apply canvas padding override
        if (config.canvasPadding !== undefined) {
            processed = this.adjustCanvasPadding(processed, config.canvasPadding);
        }

        // Toggle background
        if (!config.includeBackground) {
            processed = this.removeBackground(processed);
        }

        // Minify if requested
        if (config.minify) {
            processed = this.minify(processed);
        }

        return processed;
    }

    /**
     * Adjust SVG width while maintaining aspect ratio
     */
    private adjustWidth(svg: string, targetWidth: number): string {
        // Extract current viewBox
        const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
        if (!viewBoxMatch) {
            return svg;
        }

        const [, , vbWidth, vbHeight] = viewBoxMatch[1].split(' ').map(Number);
        const aspectRatio = vbHeight / vbWidth;
        const newHeight = Math.round(targetWidth * aspectRatio);

        // Replace width and height attributes on the root SVG element only
        let result = svg.replace(/(<svg[^>]*\s)width="[^"]+"/, `$1width="${targetWidth}"`);
        result = result.replace(/(<svg[^>]*\s)height="[^"]+"/, `$1height="${newHeight}"`);

        return result;
    }

    /**
     * Adjust canvas padding by modifying viewBox
     */
    private adjustCanvasPadding(svg: string, padding: number): string {
        const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
        if (!viewBoxMatch) {
            return svg;
        }

        const [x, y, width, height] = viewBoxMatch[1].split(' ').map(Number);

        // Calculate new viewBox with adjusted padding
        const newX = x - padding;
        const newY = y - padding;
        const newWidth = width + padding * 2;
        const newHeight = height + padding * 2;

        return svg.replace(
            /viewBox="[^"]+"/,
            `viewBox="${newX} ${newY} ${newWidth} ${newHeight}"`
        );
    }

    /**
     * Remove background elements from SVG
     */
    private removeBackground(svg: string): string {
        // Remove background rect elements (simple pattern matching)
        let result = svg.replace(/<rect width="100%" height="100%" fill="[^"]+"\s*\/>\n/g, '');
        result = result.replace(/<rect width="\d+" height="\d+" fill="[^"]+"\s*\/>\n/g, '');
        result = result.replace(/<rect width="\d+" height="\d+" fill="url\(#grid\)"[^>]*\/>\n/g, '');

        return result;
    }

    /**
     * Basic SVG minification (whitespace removal)
     * Does NOT use external libraries
     */
    minify(svg: string): string {
        let minified = svg;

        // Remove comments
        minified = minified.replace(/<!--[\s\S]*?-->/g, '');

        // Remove extra whitespace between tags
        minified = minified.replace(/>\s+</g, '><');

        // Remove leading/trailing whitespace on lines
        minified = minified.replace(/^\s+/gm, '');
        minified = minified.replace(/\s+$/gm, '');

        // Collapse multiple spaces to single space
        minified = minified.replace(/\s{2,}/g, ' ');

        // Remove newlines (optional, makes it single line)
        minified = minified.replace(/\n/g, '');

        return minified.trim();
    }
}

// ============================================================================
// WIDTH PRESETS
// ============================================================================

export const WIDTH_PRESETS = {
    SMALL: 600,
    MEDIUM: 800,
    LARGE: 1200,
    XLARGE: 1600,
    AUTO: 'auto' as const
} as const;

// ============================================================================
// EXPORT CONFIGURATION HELPERS
// ============================================================================

/**
 * Get default export configuration
 */
export function getDefaultExportConfig(): ExportConfig {
    return {
        includeBackground: true,
        widthPreset: 'auto',
        minify: false
    };
}

/**
 * Create export configuration with overrides
 */
export function createExportConfig(overrides: Partial<ExportConfig>): ExportConfig {
    return {
        ...getDefaultExportConfig(),
        ...overrides
    };
}
