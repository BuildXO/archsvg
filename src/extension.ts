// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('ArchSVG is now active!');

	// Register all commands
	context.subscriptions.push(
		vscode.commands.registerCommand('archsvg.generateIcon', () => commands.generateIcon(context)),
		vscode.commands.registerCommand('archsvg.generateFlowchart', () => commands.generateFlowchart(context)),
		vscode.commands.registerCommand('archsvg.generateFlowchartFromComment', () => commands.generateFlowchartFromComment(context)),
		vscode.commands.registerCommand('archsvg.insertSvg', commands.insertSvg),
		vscode.commands.registerCommand('archsvg.saveSvg', commands.saveSvg),
		vscode.commands.registerCommand('archsvg.previewSvg', () => commands.previewSvg(context))
	);

	vscode.window.showInformationMessage('ArchSVG ready!');
}

// This method is called when your extension is deactivated
export function deactivate() {}
