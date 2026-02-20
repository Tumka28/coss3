/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ILanguageModelsService, ILanguageModelChatMetadata, ILanguageModelChatProvider, ILanguageModelChatMetadataAndIdentifier, ILanguageModelChatInfoOptions, ILanguageModelChatResponse, IChatMessage, IChatResponsePart } from '../common/languageModels.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { localize } from '../../../../nls.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ChatAgentLocation } from '../common/constants.js';

interface IOllamaModel {
	name: string;
	model: string;
	modified_at: string;
	size: number;
	digest: string;
	details: {
		format: string;
		family: string;
		families: string[];
		parameter_size: string;
		quantization_level: string;
	};
}

interface IOllamaListResponse {
	models: IOllamaModel[];
}

interface IOllamaChatRequest {
	model: string;
	messages: Array<{
		role: string;
		content: string;
	}>;
	stream?: boolean;
}

interface IOllamaChatResponse {
	model: string;
	created_at: string;
	message: {
		role: string;
		content: string;
	};
	done: boolean;
}

export const IOllamaLanguageModelsService = createDecorator<IOllamaLanguageModelsService>('ollamaLanguageModelsService');

export interface IOllamaLanguageModelsService {
	readonly _serviceBrand: undefined;
	fetchAndRegisterModels(): Promise<void>;
	setEndpoint(endpoint: string): void;
	getEndpoint(): string;
	testConnection(): Promise<boolean>;
}

class OllamaLanguageModelProvider extends Disposable implements ILanguageModelChatProvider {
	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private _ollamaModels: IOllamaModel[] = [];
	private _ollamaEndpoint: string;

	constructor(
		ollamaEndpoint: string,
		@ILogService private readonly logService: ILogService
	) {
		super();
		this._ollamaEndpoint = ollamaEndpoint;
	}

	updateEndpoint(endpoint: string): void {
		this._ollamaEndpoint = endpoint;
	}

	async provideLanguageModelChatInfo(options: ILanguageModelChatInfoOptions, token: CancellationToken): Promise<ILanguageModelChatMetadataAndIdentifier[]> {
		if (this._ollamaModels.length === 0) {
			return [];
		}

		const extensionId = new ExtensionIdentifier('vscode.ollama');

		return this._ollamaModels.map((model, index) => {
			const modelId = `ollama:${model.name}`;
			// First model is default for all locations so it shows up in the picker
			const isFirst = index === 0;
			const metadata: ILanguageModelChatMetadata = {
				extension: extensionId,
				id: modelId,
				name: model.name,
				vendor: 'ollama',
				family: model.details?.family || 'unknown',
				version: '1.0',
				maxInputTokens: 4096,
				maxOutputTokens: 2048,
				tooltip: `Local Ollama model: ${model.name}`,
				detail: model.details?.parameter_size,
				isDefaultForLocation: isFirst ? {
					[ChatAgentLocation.Chat]: true,
					[ChatAgentLocation.Terminal]: true,
					[ChatAgentLocation.Notebook]: true,
					[ChatAgentLocation.EditorInline]: true,
				} : {},
				isUserSelectable: true,
				capabilities: {
					toolCalling: true,
					agentMode: true,
				},
				modelPickerCategory: {
					label: localize('ollama.category', "Local Models"),
					order: 100
				}
			};

			return {
				metadata,
				identifier: modelId
			};
		});
	}

	async sendChatRequest(modelId: string, messages: IChatMessage[], from: ExtensionIdentifier, options: { [name: string]: unknown }, token: CancellationToken): Promise<ILanguageModelChatResponse> {
		const modelName = modelId.replace('ollama:', '');

		const ollamaMessages = messages.map(msg => ({
			role: msg.role === 0 ? 'system' : msg.role === 1 ? 'user' : 'assistant',
			content: this.extractTextContent(msg.content)
		}));

		const requestBody: IOllamaChatRequest = {
			model: modelName,
			messages: ollamaMessages,
			stream: true
		};

		const response = await fetch(`${this._ollamaEndpoint}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`Ollama API error: ${response.statusText}`);
		}

		return {
			stream: this.streamResponse(response, token),
			result: Promise.resolve({})
		};
	}

	async provideTokenCount(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number> {
		const text = typeof message === 'string' ? message : this.extractTextContent(message.content);
		// Rough estimation: ~4 characters per token
		return Math.ceil(text.length / 4);
	}

	private extractTextContent(content: unknown): string {
		if (typeof content === 'string') {
			return content;
		}
		if (Array.isArray(content)) {
			return content.map(part => {
				if (typeof part === 'string') {
					return part;
				}
				if (typeof part === 'object' && part !== null) {
					// Handle both { type: 'text', value: '...' } and { type: 'text', text: '...' }
					const obj = part as Record<string, unknown>;
					if (obj.type === 'text') {
						return (obj.value as string) || (obj.text as string) || '';
					}
				}
				return '';
			}).join('');
		}
		return '';
	}

	private async *streamResponse(response: Response, token: CancellationToken): AsyncIterable<IChatResponsePart> {
		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('Response body is not readable');
		}

		const decoder = new TextDecoder();
		let buffer = '';

		try {
			while (true) {
				if (token.isCancellationRequested) {
					reader.cancel();
					break;
				}

				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (!line.trim()) {
						continue;
					}

					try {
						const data: IOllamaChatResponse = JSON.parse(line);

						if (data.message?.content) {
							yield {
								type: 'text',
								value: data.message.content
							};
						}

						if (data.done) {
							return;
						}
					} catch (e) {
						this.logService.error('[Ollama] Error parsing response line:', e);
					}
				}
			}
		} finally {
			reader.releaseLock();
		}
	}

	setModels(models: IOllamaModel[]): void {
		this._ollamaModels = models;
		this._onDidChange.fire();
	}
}

export class OllamaLanguageModelsService extends Disposable implements IWorkbenchContribution, IOllamaLanguageModelsService {
	static readonly ID = 'workbench.contrib.ollamaLanguageModels';
	declare readonly _serviceBrand: undefined;

	private _ollamaEndpoint: string;
	private _provider: OllamaLanguageModelProvider | undefined;
	private _providerDisposable: IDisposable | undefined;
	private _vendorRegistered: boolean = false;

	private static readonly STORAGE_KEY = 'ollama.endpoint';
	private static readonly DEFAULT_ENDPOINT = 'http://localhost:11434';

	constructor(
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@ILogService private readonly logService: ILogService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		// Load endpoint from storage
		this._ollamaEndpoint = this.storageService.get(OllamaLanguageModelsService.STORAGE_KEY, StorageScope.APPLICATION, OllamaLanguageModelsService.DEFAULT_ENDPOINT);

		// Register the vendor once at startup
		this.registerVendor();

		// Auto-connect on startup
		this.autoConnectToOllama();
	}

	private registerVendor(): void {
		if (this._vendorRegistered) {
			return;
		}

		// Check if vendor is already registered
		const existingVendors = this.languageModelsService.getVendors();
		if (existingVendors.some(v => v.vendor === 'ollama')) {
			this._vendorRegistered = true;
			this.logService.info('[Ollama] Vendor already registered');
			return;
		}

		// Register the Ollama vendor descriptor
		this.languageModelsService.deltaLanguageModelChatProviderDescriptors([{
			vendor: 'ollama',
			displayName: 'Ollama',
			configuration: undefined,
			managementCommand: undefined,
			when: undefined,
		}], []);

		this._vendorRegistered = true;
		this.logService.info('[Ollama] Vendor registered');
	}

	async fetchAndRegisterModels(): Promise<void> {
		this.logService.info(`[Ollama] Fetching models from ${this._ollamaEndpoint}`);

		const models = await this.fetchOllamaModels();

		if (models.length === 0) {
			this.logService.warn('[Ollama] No models found');
			return;
		}

		// If provider already exists, just update the models (no need to re-register)
		if (this._provider && this._providerDisposable) {
			this._provider.updateEndpoint(this._ollamaEndpoint);
			this._provider.setModels(models);
			this.logService.info(`[Ollama] Updated ${models.length} models on existing provider`);
			return;
		}

		// Create new provider and register it for the first time
		this._provider = new OllamaLanguageModelProvider(this._ollamaEndpoint, this.logService);
		this._providerDisposable = this.languageModelsService.registerLanguageModelProvider('ollama', this._provider);

		// Set models after registration - fires onDidChange to trigger model resolution
		this._provider.setModels(models);

		// Wait for models to be cached
		const modelIds = models.map(m => `ollama:${m.name}`);
		for (let i = 0; i < 10; i++) {
			const cachedIds = this.languageModelsService.getLanguageModelIds();
			if (modelIds.some(id => cachedIds.includes(id))) {
				break;
			}
			await new Promise(resolve => setTimeout(resolve, 50));
		}

		this.logService.info(`[Ollama] Registered ${models.length} models`);
	}

	private async fetchOllamaModels(): Promise<IOllamaModel[]> {
		try {
			const response = await fetch(`${this._ollamaEndpoint}/api/tags`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: IOllamaListResponse = await response.json();
			return data.models || [];
		} catch (error) {
			this.logService.error('[Ollama] Error fetching models:', error);
			throw error;
		}
	}

	setEndpoint(endpoint: string): void {
		this._ollamaEndpoint = endpoint;
		this.storageService.store(OllamaLanguageModelsService.STORAGE_KEY, endpoint, StorageScope.APPLICATION, StorageTarget.USER);
	}

	getEndpoint(): string {
		return this._ollamaEndpoint;
	}

	async testConnection(): Promise<boolean> {
		try {
			const response = await fetch(`${this._ollamaEndpoint}/api/tags`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			return response.ok;
		} catch (error) {
			this.logService.error('[Ollama] Connection test failed:', error);
			return false;
		}
	}

	private async autoConnectToOllama(): Promise<void> {
		this.logService.info('[Ollama] Attempting auto-connect...');

		try {
			const isConnected = await this.testConnection();

			if (isConnected) {
				await this.fetchAndRegisterModels();
				this.logService.info('[Ollama] Auto-connected successfully');
			} else {
				this.logService.info('[Ollama] Auto-connect failed - Ollama not reachable');
			}
		} catch (error) {
			this.logService.error('[Ollama] Auto-connect error:', error);
		}
	}

	override dispose(): void {
		this._providerDisposable?.dispose();
		super.dispose();
	}
}
