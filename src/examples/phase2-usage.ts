/**
 * Phase 2 Usage Examples
 * Demonstrates how to use the advanced flowchart generation features
 */

import { 
    AdvancedFlowchartGenerator, 
    generateWithLayout, 
    generateWithTheme,
    getTheme,
    getTypography,
    WIDTH_PRESETS,
    DiagramConfig,
    FlowchartData 
} from '../generators';

// ============================================================================
// EXAMPLE DATA
// ============================================================================

const sampleFlowchart: FlowchartData = {
    nodes: [
        { id: 'start', label: 'Start' },
        { id: 'auth', label: 'Authenticate' },
        { id: 'validate', label: 'Validate Input' },
        { id: 'process', label: 'Process Data' },
        { id: 'success', label: 'Success' },
        { id: 'error', label: 'Error' }
    ],
    edges: [
        { from: 'start', to: 'auth' },
        { from: 'auth', to: 'validate' },
        { from: 'validate', to: 'process' },
        { from: 'process', to: 'success' },
        { from: 'validate', to: 'error' },
        { from: 'auth', to: 'error' }
    ]
};

// ============================================================================
// EXAMPLE 1: Quick Generation with Defaults
// ============================================================================

export function example1_QuickGeneration() {
    const generator = new AdvancedFlowchartGenerator();
    const svg = generator.generate(sampleFlowchart);
    
    console.log('Generated SVG with default settings');
    return svg;
}

// ============================================================================
// EXAMPLE 2: Different Layout Modes
// ============================================================================

export function example2_LayoutModes() {
    // Vertical (default)
    const vertical = generateWithLayout(sampleFlowchart, 'vertical');
    
    // Horizontal (left-to-right)
    const horizontal = generateWithLayout(sampleFlowchart, 'horizontal');
    
    // Compact Vertical (tighter spacing)
    const compact = generateWithLayout(sampleFlowchart, 'compact-vertical');
    
    // Symmetric (balanced branching)
    const symmetric = generateWithLayout(sampleFlowchart, 'symmetric');
    
    return { vertical, horizontal, compact, symmetric };
}

// ============================================================================
// EXAMPLE 3: Different Themes
// ============================================================================

export function example3_Themes() {
    // GitHub Light
    const githubLight = generateWithTheme(sampleFlowchart, 'github-light');
    
    // GitHub Dark
    const githubDark = generateWithTheme(sampleFlowchart, 'github-dark');
    
    // Minimal Mono
    const minimal = generateWithTheme(sampleFlowchart, 'minimal-mono');
    
    // Blueprint
    const blueprint = generateWithTheme(sampleFlowchart, 'blueprint');
    
    return { githubLight, githubDark, minimal, blueprint };
}

// ============================================================================
// EXAMPLE 4: Custom Configuration
// ============================================================================

export function example4_CustomConfiguration() {
    const config: Partial<DiagramConfig> = {
        layoutMode: 'horizontal',
        theme: getTheme('github-dark'),
        typography: getTypography('bold'),
        layout: {
            nodeWidth: 160,
            nodeHeight: 60,
            verticalSpacing: 100,
            horizontalSpacing: 80,
            padding: 50
        },
        routing: {
            verticalGap: 30,
            nodeClearance: 15,
            balancedMerges: true
        },
        export: {
            includeBackground: true,
            widthPreset: WIDTH_PRESETS.LARGE,
            minify: false
        }
    };
    
    const generator = new AdvancedFlowchartGenerator(config);
    return generator.generate(sampleFlowchart);
}

// ============================================================================
// EXAMPLE 5: Dynamic Configuration Updates
// ============================================================================

export function example5_DynamicUpdates() {
    const generator = new AdvancedFlowchartGenerator();
    
    // Generate with default settings
    const svg1 = generator.generate(sampleFlowchart);
    
    // Update to horizontal layout
    generator.updateConfig({ layoutMode: 'horizontal' });
    const svg2 = generator.generate(sampleFlowchart);
    
    // Update theme to dark
    generator.updateConfig({ theme: getTheme('github-dark') });
    const svg3 = generator.generate(sampleFlowchart);
    
    return { svg1, svg2, svg3 };
}

// ============================================================================
// EXAMPLE 6: Export Options
// ============================================================================

export function example6_ExportOptions() {
    // High-quality export with background
    const hqGenerator = new AdvancedFlowchartGenerator({
        export: {
            includeBackground: true,
            widthPreset: WIDTH_PRESETS.XLARGE,
            minify: false
        }
    });
    const hqSvg = hqGenerator.generate(sampleFlowchart);
    
    // Minimal export without background (for embedding)
    const minimalGenerator = new AdvancedFlowchartGenerator({
        export: {
            includeBackground: false,
            widthPreset: 'auto',
            minify: true
        }
    });
    const minimalSvg = minimalGenerator.generate(sampleFlowchart);
    
    return { hqSvg, minimalSvg };
}

// ============================================================================
// EXAMPLE 7: Complete Custom Setup
// ============================================================================

export function example7_CompleteCustomSetup() {
    const generator = new AdvancedFlowchartGenerator({
        layoutMode: 'symmetric',
        theme: {
            name: 'Custom',
            colors: {
                background: '#ffffff',
                nodeFill: '#e0f2fe',
                nodeStroke: '#0369a1',
                nodeText: '#0c4a6e',
                edgeStroke: '#0284c7',
                edgeArrowhead: '#0284c7',
                gridPattern: '#f0f9ff'
            },
            nodeStyle: {
                strokeWidth: 2,
                borderRadius: 8,
                shadowEnabled: true
            },
            edgeStyle: {
                strokeWidth: 2.5,
                arrowheadSize: 9
            }
        },
        typography: {
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 0.3
        },
        layout: {
            nodeWidth: 150,
            nodeHeight: 55,
            verticalSpacing: 90,
            horizontalSpacing: 70,
            padding: 45
        },
        routing: {
            verticalGap: 25,
            nodeClearance: 12,
            balancedMerges: true
        },
        export: {
            includeBackground: true,
            widthPreset: WIDTH_PRESETS.LARGE,
            minify: false
        }
    });
    
    return generator.generate(sampleFlowchart);
}

// ============================================================================
// EXAMPLE 8: VS Code Configuration Integration
// ============================================================================

export function example8_VSCodeConfigIntegration(vscodeConfig: any) {
    // Read configuration from VS Code settings
    const layoutMode = vscodeConfig.get('svgGen.layoutMode', 'vertical');
    const themeName = vscodeConfig.get('svgGen.theme', 'github-light');
    const typographyName = vscodeConfig.get('svgGen.typography', 'default');
    const widthPreset = vscodeConfig.get('svgGen.exportWidth', 'auto');
    const includeBackground = vscodeConfig.get('svgGen.includeBackground', true);
    const minifyOutput = vscodeConfig.get('svgGen.minifyOutput', false);
    
    const config: Partial<DiagramConfig> = {
        layoutMode,
        theme: getTheme(themeName),
        typography: getTypography(typographyName),
        export: {
            includeBackground,
            widthPreset: widthPreset === 'auto' ? 'auto' : parseInt(widthPreset),
            minify: minifyOutput
        }
    };
    
    const generator = new AdvancedFlowchartGenerator(config);
    return generator.generate(sampleFlowchart);
}
