import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('activates and registers the ehrQL debug command', async () => {
		const extension = vscode.extensions.getExtension('bennettoxford.opensafely');
		assert.ok(extension, 'Expected the OpenSAFELY extension to be available');

		await extension.activate();

		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('ehrql.debug'));
	});
});
