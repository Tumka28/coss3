/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { OpenClawGateway } from './gateway';
import { OpenClawChatViewProvider } from './chatViewProvider';

let gateway: OpenClawGateway | undefined;

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('openclaw');
	const port = config.get<number>('gatewayPort', 18789);

	gateway = new OpenClawGateway(port);

	const chatProvider = new OpenClawChatViewProvider(context.extensionUri, gateway);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('openclaw.chatView', chatProvider, {
			webviewOptions: { retainContextWhenHidden: true }
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openclaw.openChat', () => {
			vscode.commands.executeCommand('openclaw.chatView.focus');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openclaw.startGateway', async () => {
			try {
				await gateway!.start();
				vscode.window.showInformationMessage(`OpenClaw Gateway started on port ${port}`);
			} catch (err) {
				vscode.window.showErrorMessage(`Failed to start Gateway: ${err}`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openclaw.stopGateway', () => {
			gateway!.stop();
			vscode.window.showInformationMessage('OpenClaw Gateway stopped');
		})
	);

	context.subscriptions.push({
		dispose() {
			gateway?.stop();
		}
	});

	const autoStart = config.get<boolean>('autoStartGateway', true);
	if (autoStart) {
		gateway.start().catch(_err => {
			// Gateway auto-start failed; user can start manually via command
		});
	}
}

export function deactivate() {
	gateway?.stop();
	gateway = undefined;
}
