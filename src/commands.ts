import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BasicSvgIconGenerator, BasicFlowchartGenerator } from './generators';
import { SvgSanitizer } from './utils/svgSanitizer';
import { SvgPreviewPanel } from './webview/previewPanel';
import { parseCommentToFlowchart } from './parsers/commentFlowParser';

/**
 * Shared state for last generated SVG
 */
let lastGeneratedSvg: string = '';

/**
 * Generate SVG Icon from text prompt
 */
export async function generateIcon(context: vscode.ExtensionContext) {
    const prompt = await vscode.window.showInputBox({
        prompt: 'Enter icon description (e.g., "check", "warning", "star", "user")',
        placeHolder: 'check, warning, star, heart, gear, folder, file, user, info...'
    });

    if (!prompt) {
        return;
    }

    try {
        const config = vscode.workspace.getConfiguration('svgGen');
        const primaryColor = config.get<string>('primaryColor', '#3498db');
        const secondaryColor = config.get<string>('secondaryColor', '#2ecc71');

        const generator = new BasicSvgIconGenerator(primaryColor, secondaryColor);
        const svg = await generator.generate(prompt);
        
        const sanitized = SvgSanitizer.sanitize(svg);
        lastGeneratedSvg = sanitized;

        SvgPreviewPanel.createOrShow(context.extensionUri, sanitized);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate icon: ${error}`);
    }
}

/**
 * Generate Flowchart from JSON
 */
export async function generateFlowchart(context: vscode.ExtensionContext) {
    const jsonInput = await vscode.window.showInputBox({
        prompt: 'Enter flowchart JSON',
        placeHolder: '{"nodes": [{"id": "start", "label": "Start"}], "edges": [{"from": "start", "to": "end"}]}',
        value: '{\n  "nodes": [\n    {"id": "start", "label": "Start"},\n    {"id": "process", "label": "Process"},\n    {"id": "end", "label": "End"}\n  ],\n  "edges": [\n    {"from": "start", "to": "process"},\n    {"from": "process", "to": "end"}\n  ]\n}'
    });

    if (!jsonInput) {
        return;
    }

    try {
        const config = vscode.workspace.getConfiguration('svgGen');
        const primaryColor = config.get<string>('primaryColor', '#3498db');
        const secondaryColor = config.get<string>('secondaryColor', '#2ecc71');

        const generator = new BasicFlowchartGenerator(primaryColor, secondaryColor);
        const svg = await generator.generate(jsonInput);
        
        const sanitized = SvgSanitizer.sanitize(svg);
        lastGeneratedSvg = sanitized;

        SvgPreviewPanel.createOrShow(context.extensionUri, sanitized);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate flowchart: ${error}`);
    }
}

/**
 * Generate Flowchart from Selected Comment
 * Parses comment-style arrow notation like: // User -> API -> Database
 */
export async function generateFlowchartFromComment(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showErrorMessage('Please select comment lines with arrow notation (e.g., "// A -> B").');
        return;
    }

    const selectedText = editor.document.getText(selection);

    try {
        // Parse comment to flowchart data
        const flowchartData = parseCommentToFlowchart(selectedText);

        // Convert to JSON string for existing generator
        const jsonInput = JSON.stringify(flowchartData, null, 2);

        // Use existing flowchart generator
        const config = vscode.workspace.getConfiguration('svgGen');
        const primaryColor = config.get<string>('primaryColor', '#3498db');
        const secondaryColor = config.get<string>('secondaryColor', '#2ecc71');

        const generator = new BasicFlowchartGenerator(primaryColor, secondaryColor);
        const svg = await generator.generate(jsonInput);
        
        // Sanitize and preview
        const sanitized = SvgSanitizer.sanitize(svg);
        lastGeneratedSvg = sanitized;

        SvgPreviewPanel.createOrShow(context.extensionUri, sanitized);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to parse flowchart: ${error}`);
    }
}

/**
 * Insert last generated SVG into active file
 */
export async function insertSvg() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    if (!lastGeneratedSvg) {
        vscode.window.showErrorMessage('No SVG generated yet. Please generate an SVG first.');
        return;
    }

    try {
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, lastGeneratedSvg);
        });

        vscode.window.showInformationMessage('SVG inserted into active file.');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to insert SVG: ${error}`);
    }
}

/**
 * Save last generated SVG to /assets folder
 */
export async function saveSvg() {
    if (!lastGeneratedSvg) {
        vscode.window.showErrorMessage('No SVG generated yet. Please generate an SVG first.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
    }

    const fileName = await vscode.window.showInputBox({
        prompt: 'Enter file name (without extension)',
        placeHolder: 'my-icon',
        value: 'generated-asset'
    });

    if (!fileName) {
        return;
    }

    try {
        const workspacePath = workspaceFolders[0].uri.fsPath;
        const assetsDir = path.join(workspacePath, 'assets');

        // Create assets directory if it doesn't exist
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        const filePath = path.join(assetsDir, `${fileName}.svg`);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            const overwrite = await vscode.window.showWarningMessage(
                `File "${fileName}.svg" already exists. Overwrite?`,
                'Yes',
                'No'
            );

            if (overwrite !== 'Yes') {
                return;
            }
        }

        fs.writeFileSync(filePath, lastGeneratedSvg, 'utf8');

        vscode.window.showInformationMessage(`SVG saved to ${path.relative(workspacePath, filePath)}`);

        // Optionally open the file
        const openFile = await vscode.window.showInformationMessage(
            'Do you want to open the file?',
            'Yes',
            'No'
        );

        if (openFile === 'Yes') {
            const doc = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(doc);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to save SVG: ${error}`);
    }
}

/**
 * Preview SVG from selection or input
 */
export async function previewSvg(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;
    let svgContent: string | undefined;

    // Try to get SVG from selection first
    if (editor && !editor.selection.isEmpty) {
        svgContent = editor.document.getText(editor.selection);
    }

    // If no selection, ask for input
    if (!svgContent) {
        svgContent = await vscode.window.showInputBox({
            prompt: 'Paste or enter SVG content',
            placeHolder: '<svg>...</svg>'
        });
    }

    if (!svgContent) {
        return;
    }

    try {
        // Extract SVG if it's embedded in other text
        const extracted = SvgSanitizer.extractSvg(svgContent);
        if (!extracted) {
            vscode.window.showErrorMessage('No valid SVG found in the input.');
            return;
        }

        // Validate SVG
        if (!SvgSanitizer.isValidSvg(extracted)) {
            vscode.window.showErrorMessage('Invalid SVG format.');
            return;
        }

        // Sanitize and preview
        const sanitized = SvgSanitizer.sanitize(extracted);
        lastGeneratedSvg = sanitized;

        SvgPreviewPanel.createOrShow(context.extensionUri, sanitized);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to preview SVG: ${error}`);
    }
}
