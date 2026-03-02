import * as vscode from 'vscode';
import { SvgSanitizer } from '../utils/svgSanitizer';

/**
 * Manages SVG preview webview panels
 */
export class SvgPreviewPanel {
    private static currentPanel: SvgPreviewPanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        // Set up event listeners
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Handle messages from webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'save':
                        vscode.commands.executeCommand('svg-asset-generator.saveSvg');
                        return;
                    case 'insert':
                        vscode.commands.executeCommand('svg-asset-generator.insertSvg');
                        return;
                    case 'dismiss':
                        this.panel.dispose();
                        return;
                }
            },
            null,
            this.disposables
        );
    }

    /**
     * Create or show the preview panel
     */
    public static createOrShow(extensionUri: vscode.Uri, svgContent: string) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (SvgPreviewPanel.currentPanel) {
            SvgPreviewPanel.currentPanel.panel.reveal(column);
            SvgPreviewPanel.currentPanel.update(svgContent);
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            'svgPreview',
            'SVG Preview',
            column || vscode.ViewColumn.Two,
            {
                enableScripts: true, // Enable for button interactions
                localResourceRoots: [],
                retainContextWhenHidden: true
            }
        );

        SvgPreviewPanel.currentPanel = new SvgPreviewPanel(panel, extensionUri);
        SvgPreviewPanel.currentPanel.update(svgContent);
    }

    /**
     * Update the webview content
     */
    public update(svgContent: string) {
        // Sanitize the SVG content
        const sanitized = SvgSanitizer.sanitize(svgContent);

        this.panel.webview.html = this.getHtmlContent(sanitized);
    }

    /**
     * Dispose the panel
     */
    public dispose() {
        SvgPreviewPanel.currentPanel = undefined;

        this.panel.dispose();

        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
     * Generate HTML for the webview
     */
    private getHtmlContent(svgContent: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>SVG Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            padding: 32px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .container {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
            max-width: 1200px;
            width: 100%;
            overflow: hidden;
            animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            padding: 12px 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
        }
        
        .header-icon {
            width: 20px;
            height: 20px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
        }
        
        .header-text {
            flex: 1;
        }
        
        .header-title {
            font-size: 13px;
            font-weight: 500;
            color: #334155;
        }
        
        .header-subtitle {
            display: none;
        }
        
        .svg-wrapper {
            padding: 48px 32px;
            background: #fafafa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            overflow: auto;
        }
        
        .svg-wrapper::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        .svg-wrapper::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .svg-wrapper::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        
        .svg-wrapper::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        
        svg {
            max-width: 100%;
            height: auto;
            display: block;
        }
        
        .actions {
            padding: 24px 32px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            background: #ffffff;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            font-family: inherit;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            letter-spacing: 0.01em;
        }
        
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563eb;
        }
        
        .btn-secondary {
            background: #10b981;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #059669;
        }
        
        .btn-tertiary {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
        }
        
        .btn-tertiary:hover {
            background: #e2e8f0;
            border-color: #94a3b8;
        }
        
        .info {
            padding: 16px 32px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            text-align: center;
            font-size: 12px;
            line-height: 1.5;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 16px 8px;
            }
            
            .header {
                padding: 16px 20px;
            }
            
            .svg-wrapper {
                padding: 32px 20px;
            }
            
            .actions {
                padding: 20px;
                gap: 8px;
            }
            
            .btn {
                flex: 1;
                min-width: 0;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-icon">✓</div>
            <div class="header-text">
                <div class="header-title">SVG Generated</div>
            </div>
        </div>
        
        <div class="svg-wrapper">
            ${svgContent}
        </div>
        
        <div class="actions">
            <button class="btn btn-primary" onclick="handleAction('save')">
                <span>💾</span>
                <span>Save to /assets</span>
            </button>
            <button class="btn btn-secondary" onclick="handleAction('insert')">
                <span>📄</span>
                <span>Insert into File</span>
            </button>
            <button class="btn btn-tertiary" onclick="handleAction('dismiss')">
                <span>✕</span>
                <span>Dismiss</span>
            </button>
        </div>
        
        <div class="info">
            Use the buttons above to save the SVG to your workspace or insert it directly into the active editor
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function handleAction(action) {
            vscode.postMessage({ command: action });
        }
    </script>
</body>
</html>`;
    }
}
