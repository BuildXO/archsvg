// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('SVG & AI Asset Generator is now active!');

	// Register all commands
	context.subscriptions.push(
		vscode.commands.registerCommand('svg-asset-generator.generateIcon', () => commands.generateIcon(context)),
		vscode.commands.registerCommand('svg-asset-generator.generateFlowchart', () => commands.generateFlowchart(context)),
		vscode.commands.registerCommand('svg-asset-generator.generateFlowchartFromComment', () => commands.generateFlowchartFromComment(context)),
		vscode.commands.registerCommand('svg-asset-generator.insertSvg', commands.insertSvg),
		vscode.commands.registerCommand('svg-asset-generator.saveSvg', commands.saveSvg),
		vscode.commands.registerCommand('svg-asset-generator.previewSvg', () => commands.previewSvg(context))
	);

	vscode.window.showInformationMessage('SVG & AI Asset Generator ready!');
}

// This method is called when your extension is deactivated
export function deactivate() {}
