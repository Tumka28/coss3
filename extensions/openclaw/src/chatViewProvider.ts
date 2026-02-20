/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type { OpenClawGateway } from './gateway';

export class OpenClawChatViewProvider implements vscode.WebviewViewProvider {

	private _view?: vscode.WebviewView;
	private readonly _gateway: OpenClawGateway;

	constructor(_extensionUri: vscode.Uri, gateway: OpenClawGateway) {
		this._gateway = gateway;
	}

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	): void {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			enableForms: true,
		};

		this._updateHtml();

		this._gateway.onDidChangeState(() => {
			this._updateHtml();
		});
	}

	private _updateHtml(): void {
		if (!this._view) {
			return;
		}

		const port = this._gateway.port;
		const running = this._gateway.running;

		if (running) {
			this._view.webview.html = this._getChatHtml(port);
		} else {
			this._view.webview.html = this._getLoadingHtml();
		}
	}

	private _getChatHtml(port: number): string {
		const gatewayUrl = `http://127.0.0.1:${port}`;
		const token = this._gateway.token || '';
		const nonce = getNonce();

		return /* html */ `<!DOCTYPE html>
<html lang="en" style="height: 100%; margin: 0; padding: 0;">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy" content="
		default-src 'none';
		frame-src http://127.0.0.1:* http://localhost:*;
		style-src 'nonce-${nonce}';
		script-src 'nonce-${nonce}';
		connect-src http://127.0.0.1:* ws://127.0.0.1:*;
	">
	<style nonce="${nonce}">
		html, body {
			height: 100%;
			margin: 0;
			padding: 0;
			overflow: hidden;
			background: var(--vscode-editor-background, #1e1e1e);
		}
		iframe {
			width: 100%;
			height: 100%;
			border: none;
		}
	</style>
</head>
<body>
	<iframe id="chatFrame" sandbox="allow-scripts allow-forms allow-same-origin"></iframe>
	<script nonce="${nonce}">
		const frame = document.getElementById('chatFrame');
		const url = '${gatewayUrl}/?token=${token}';
		frame.src = url;
	</script>
</body>
</html>`;
	}

	private _getLoadingHtml(): string {
		const nonce = getNonce();
		return /* html */ `<!DOCTYPE html>
<html lang="en" style="height: 100%; margin: 0; padding: 0;">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy" content="
		default-src 'none';
		style-src 'nonce-${nonce}';
		script-src 'nonce-${nonce}';
	">
	<style nonce="${nonce}">
		html, body {
			height: 100%;
			margin: 0;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--vscode-editor-background, #1e1e1e);
			color: var(--vscode-foreground, #ccc);
			font-family: var(--vscode-font-family, sans-serif);
			font-size: 13px;
		}
		.container {
			text-align: center;
			padding: 20px;
		}
		.spinner {
			width: 24px;
			height: 24px;
			border: 2px solid var(--vscode-foreground, #ccc);
			border-top-color: transparent;
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
			margin: 0 auto 12px;
		}
		@keyframes spin {
			to { transform: rotate(360deg); }
		}
		button {
			margin-top: 12px;
			padding: 6px 14px;
			background: var(--vscode-button-background, #0e639c);
			color: var(--vscode-button-foreground, #fff);
			border: none;
			border-radius: 2px;
			cursor: pointer;
			font-size: 13px;
		}
		button:hover {
			background: var(--vscode-button-hoverBackground, #1177bb);
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="spinner"></div>
		<div>OpenClaw Gateway starting...</div>
		<div style="margin-top: 8px; opacity: 0.7;">Port ${this._gateway.port}</div>
		<button onclick="(function(){
			const vscode = acquireVsCodeApi();
			vscode.postMessage({ command: 'startGateway' });
		})()">Start Gateway</button>
	</div>
	<script nonce="${nonce}">
		const vscode = acquireVsCodeApi();
		window.addEventListener('message', event => {
			const msg = event.data;
			if (msg.command === 'startGateway') {
				vscode.postMessage({ command: 'startGateway' });
			}
		});
	</script>
</body>
</html>`;
	}
}

function getNonce(): string {
	let text = '';
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return text;
}
