/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'node:child_process';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';

export class OpenClawGateway {
	private _process: cp.ChildProcess | undefined;
	private _port: number;
	private _running = false;
	private _token: string | undefined;
	private _outputChannel: vscode.OutputChannel;

	private readonly _onDidChangeState = new vscode.EventEmitter<boolean>();
	public readonly onDidChangeState = this._onDidChangeState.event;

	constructor(port: number) {
		this._port = port;
		this._outputChannel = vscode.window.createOutputChannel('OpenClaw Gateway');
		this._token = this._readToken();
	}

	get port(): number {
		return this._port;
	}

	get running(): boolean {
		return this._running;
	}

	get token(): string | undefined {
		return this._token;
	}

	private _readToken(): string | undefined {
		try {
			const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
			const raw = fs.readFileSync(configPath, 'utf-8');
			const config = JSON.parse(raw);
			return config?.gateway?.auth?.token;
		} catch {
			return undefined;
		}
	}

	async start(): Promise<void> {
		if (this._running) {
			return;
		}

		const isAlive = await this._probe();
		if (isAlive) {
			this._running = true;
			this._onDidChangeState.fire(true);
			this._outputChannel.appendLine(`[OpenClaw] Gateway already running on port ${this._port}`);
			return;
		}

		return new Promise<void>((resolve, reject) => {
			const env = { ...process.env, OLLAMA_API_KEY: process.env['OLLAMA_API_KEY'] || 'ollama-local' };

			this._process = cp.spawn('openclaw', ['gateway', 'run', '--port', String(this._port), '--allow-unconfigured'], {
				env,
				stdio: ['ignore', 'pipe', 'pipe'],
				shell: true,
				detached: false,
			});

			let started = false;
			const timeout = setTimeout(() => {
				if (!started) {
					started = true;
					this._running = true;
					this._onDidChangeState.fire(true);
					resolve();
				}
			}, 5000);

			this._process.stdout?.on('data', (data: Buffer) => {
				const text = data.toString();
				this._outputChannel.append(text);
				if (!started && (text.includes('Gateway') || text.includes('listening') || text.includes('18789'))) {
					started = true;
					clearTimeout(timeout);
					this._running = true;
					this._onDidChangeState.fire(true);
					resolve();
				}
			});

			this._process.stderr?.on('data', (data: Buffer) => {
				this._outputChannel.append(data.toString());
			});

			this._process.on('error', (err: Error) => {
				this._outputChannel.appendLine(`[OpenClaw] Process error: ${err.message}`);
				if (!started) {
					started = true;
					clearTimeout(timeout);
					reject(err);
				}
			});

			this._process.on('exit', (code: number | null) => {
				this._outputChannel.appendLine(`[OpenClaw] Gateway exited with code ${code}`);
				this._running = false;
				this._process = undefined;
				this._onDidChangeState.fire(false);
				if (!started) {
					started = true;
					clearTimeout(timeout);
					reject(new Error(`Gateway exited with code ${code}`));
				}
			});
		});
	}

	stop(): void {
		if (this._process) {
			this._process.kill();
			this._process = undefined;
		}
		this._running = false;
		this._onDidChangeState.fire(false);
		this._outputChannel.appendLine('[OpenClaw] Gateway stopped');
	}

	private _probe(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			const req = http.get(`http://127.0.0.1:${this._port}/`, { timeout: 2000 }, (res: http.IncomingMessage) => {
				res.resume();
				resolve(res.statusCode !== undefined);
			});
			req.on('error', () => resolve(false));
			req.on('timeout', () => { req.destroy(); resolve(false); });
		});
	}
}
