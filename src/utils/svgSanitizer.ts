/**
 * SVG Sanitizer Utility
 * Removes potentially dangerous content from SVG strings
 */
export class SvgSanitizer {
    private static readonly DANGEROUS_TAGS = [
        'script',
        'iframe',
        'embed',
        'object',
        'foreignObject',
        'form',
        'input',
        'textarea',
        'button',
        'link',
        'style' // Remove inline styles to prevent CSS injection
    ];

    private static readonly DANGEROUS_ATTRIBUTES = [
        'onload',
        'onerror',
        'onclick',
        'onmouseover',
        'onmouseout',
        'onmouseenter',
        'onmouseleave',
        'onmousemove',
        'onmousedown',
        'onmouseup',
        'onkeydown',
        'onkeyup',
        'onkeypress',
        'onfocus',
        'onblur',
        'onchange',
        'onsubmit',
        'onreset',
        'onselect',
        'onabort',
        'oncanplay',
        'oncanplaythrough',
        'ondurationchange',
        'onemptied',
        'onended',
        'onloadeddata',
        'onloadedmetadata',
        'onloadstart',
        'onpause',
        'onplay',
        'onplaying',
        'onprogress',
        'onratechange',
        'onseeked',
        'onseeking',
        'onstalled',
        'onsuspend',
        'ontimeupdate',
        'onvolumechange',
        'onwaiting'
    ];

    private static readonly SAFE_ATTRIBUTES = [
        'xmlns',
        'viewBox',
        'width',
        'height',
        'x',
        'y',
        'x1',
        'y1',
        'x2',
        'y2',
        'cx',
        'cy',
        'r',
        'rx',
        'ry',
        'fill',
        'stroke',
        'stroke-width',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-dasharray',
        'opacity',
        'd',
        'transform',
        'points',
        'id',
        'class',
        'marker-end',
        'marker-start',
        'marker-mid',
        'text-anchor',
        'font-size',
        'font-family',
        'font-weight',
        'markerWidth',
        'markerHeight',
        'refX',
        'refY',
        'orient',
        'offset',
        'stop-color',
        'stop-opacity'
    ];

    /**
     * Sanitize SVG content by removing dangerous elements and attributes
     */
    static sanitize(svgContent: string): string {
        let sanitized = svgContent;

        // Remove dangerous tags
        for (const tag of this.DANGEROUS_TAGS) {
            const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, 'gis');
            sanitized = sanitized.replace(regex, '');
            
            // Also remove self-closing tags
            const selfClosingRegex = new RegExp(`<${tag}[^>]*\/>`, 'gi');
            sanitized = sanitized.replace(selfClosingRegex, '');
        }

        // Remove dangerous attributes (event handlers)
        for (const attr of this.DANGEROUS_ATTRIBUTES) {
            const regex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
            sanitized = sanitized.replace(regex, '');
        }

        // Remove javascript: protocol in href and xlink:href
        sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
        sanitized = sanitized.replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '');

        // Remove data: URIs that might contain scripts
        sanitized = sanitized.replace(/href\s*=\s*["']data:[^"']*base64[^"']*["']/gi, '');

        return sanitized;
    }

    /**
     * Validate that the content is valid SVG
     */
    static isValidSvg(content: string): boolean {
        // Basic check: must contain <svg tag
        if (!content.includes('<svg')) {
            return false;
        }

        // Check for balanced SVG tags
        const openSvgCount = (content.match(/<svg/gi) || []).length;
        const closeSvgCount = (content.match(/<\/svg>/gi) || []).length;

        return openSvgCount > 0 && openSvgCount === closeSvgCount;
    }

    /**
     * Extract SVG from content (in case it's wrapped in other text)
     */
    static extractSvg(content: string): string | null {
        const match = content.match(/<svg[\s\S]*?<\/svg>/i);
        return match ? match[0] : null;
    }
}
