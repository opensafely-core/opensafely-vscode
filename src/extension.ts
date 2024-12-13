// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

let debugPanel: vscode.WebviewPanel | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Update context based on current editor
    updateEhrqlContext();

	// Implement the debug command defined in the package.json file
	const disposable = vscode.commands.registerCommand('ehrql.debug', () => {

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('Please open or select an ehrQL dataset definition file to run');
			return;
		}

		// Get the workspace folder
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('No workspace folder found');
			return;
		}

		const config = vscode.workspace.getConfiguration("opensafely");
		const dummyTablesDir = config.get("DummyTablesDir", "dummy_tables");
		let opensafelyPath = config.get("opensafelyPath");
		const imageVersion = config.get("EHRQLImageVersion");

		// Check that the dummy tables path exists
		const dummyTablesPath = path.join(workspaceFolder.uri.fsPath, dummyTablesDir);
		if (!fs.existsSync(dummyTablesPath)) {
			vscode.window.showErrorMessage(`Dummy table path ${dummyTablesDir}/ not found`);
			return;
		}

		// If no path is configured, look for it in the workspace venv and fall back
		// to system install
		if (!opensafelyPath) {
			// Find possible virtual environments in this workspace folder, where an
			// opensafely executable may be found
			const venvPaths = [
				path.join(workspaceFolder.uri.fsPath, 'venv'),
				path.join(workspaceFolder.uri.fsPath, '.venv'),
				path.join(workspaceFolder.uri.fsPath, 'env')
			];

			// Check for virtual environment
			for (const venvPath of venvPaths) {
				const windowsOpensafelyPath = path.join(venvPath, 'Scripts', 'opensafely.exe');
				const unixOpenSafelyPath = path.join(venvPath, 'bin', 'opensafely');

				if (fs.existsSync(windowsOpensafelyPath)) {
					opensafelyPath = windowsOpensafelyPath;
					break;
				} else if (fs.existsSync(unixOpenSafelyPath)) {
					opensafelyPath = unixOpenSafelyPath;
					break;
				}
			}

			if (!opensafelyPath) {
				// Fallback to system-installed opensafely
				opensafelyPath = 'opensafely';
			}
		}

		if (debugPanel) {
			// If the panel is already visible, just bring it to focus
			if (debugPanel.visible) {
				debugPanel.reveal();
			} else {
				// If it's not visible, reveal it in half-width column
				debugPanel.reveal(vscode.ViewColumn.Two);
			}
		} else {
			debugPanel = vscode.window.createWebviewPanel(
				'ehrql_html_display',
				'ehrQL Dataset Output',
				vscode.ViewColumn.Beside,
				{ 
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
				}
			);
			// Handle the panel disposal to clean up
			debugPanel.onDidDispose(() => { debugPanel = undefined; }, null);
		}
		
		debugPanel!.webview.html = 'Loading...';

		// Get the filename relative to the workspace folder
        const fileName = editor.document.fileName.replace(workspaceFolder.uri.fsPath + "/", "");

		// Define the command
		const command = `"${opensafelyPath}" exec ehrql:"${imageVersion}" debug "${fileName}" --dummy-tables "${dummyTablesDir}" --display-format html`;

		// Execute the command at the workspace root so we have access to the file and"
		// the dummy tables folder
		exec(command, { cwd: workspaceFolder.uri.fsPath }, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing Python script: ${command}`);
				console.error(error);
				debugPanel!.webview.html = stderr.trim();
			} else {

			const css_uri = debugPanel!.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media/style.css')));
			if (!stderr) {
				stderr = "Nothing to show.";
			}
			debugPanel!.webview.html = getWebviewContent(stderr, stdout, css_uri);
		}
		});
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateEhrqlContext));

}

function getWebviewContent(stderr: string, stdout: string, css_uri: vscode.Uri): string {
	const stderr_output = stderr.trim().replace(/\n/g, "<br>");
	return `
			<!DOCTYPE html>
			<html>
				<head>
				  <link rel="stylesheet" type="text/css" href="${css_uri}">
				</head>
				<body>
				  <div>
					  ${stderr_output}
				  </div>
				  <div class="dataset">
					${stdout.trim()}
				  </div>
				</body>
			 </html>
	`;
  }


function updateEhrqlContext() {
	const editor = vscode.window.activeTextEditor;
	// Do a very cursory check to ensure that this is an ehrQL file, and set a context variable
	// which is used in the package.json configuration to show the debug ehrql command options
	// We just check that it's a python file with the word "ehrql" in it; this obviously doesn't
	// limit the command to ONLY ehrQL dataset definitions, but it should ensure that it's always
	// enabled for dataset definition files, and it's removed for any python file that definitely
	// ISN'T a dataset definition
	if (editor && editor.document.languageId === 'python') {
		const documentText = editor.document.getText();
		const is_ehrql = documentText.search("ehrql") > 0;
		vscode.commands.executeCommand('setContext', 'isEhrqlFile', is_ehrql);
	}
}
