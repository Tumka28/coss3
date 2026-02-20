/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { localize2 } from '../../../../nls.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IChatAgentService, IChatAgentHistoryEntry } from '../common/participants/chatAgents.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ChatAgentLocation, ChatModeKind } from '../common/constants.js';
import { ILanguageModelsService, ChatMessageRole, IChatMessage } from '../common/languageModels.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IChatProgress } from '../common/chatService/chatService.js';
import { IOllamaLanguageModelsService } from './ollamaLanguageModels.js';

/**
 * Registers a default chat agent for Ollama usage.
 * This replaces the sign-in-gated default agent and actually calls
 * the Ollama language model to generate responses.
 */
export class OllamaDefaultAgentContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.ollamaDefaultAgent';

	constructor(
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@ILogService private readonly logService: ILogService,
		@IOllamaLanguageModelsService _ollamaService: IOllamaLanguageModelsService, // triggers Ollama singleton instantiation
	) {
		super();

		// Register default agents for all locations
		this.registerDefaultAgent(ChatAgentLocation.Chat, 'ollama.chat', localize2('ollamaDefaultAgent', "Ollama Chat"));
		this.registerDefaultAgent(ChatAgentLocation.Terminal, 'ollama.terminal', localize2('ollamaTerminalAgent', "Ollama Terminal"));
		this.registerDefaultAgent(ChatAgentLocation.Notebook, 'ollama.notebook', localize2('ollamaNotebookAgent', "Ollama Notebook"));
		this.registerDefaultAgent(ChatAgentLocation.EditorInline, 'ollama.editor', localize2('ollamaEditorAgent', "Ollama Editor"));
	}

	private registerDefaultAgent(location: ChatAgentLocation, id: string, name: { value: string; original: string }): void {
		const extensionId = new ExtensionIdentifier('vscode.ollama');

		this._register(this.chatAgentService.registerAgent(id, {
			id,
			name: name.value,
			extensionId,
			extensionDisplayName: 'Ollama',
			extensionPublisherId: 'vscode',
			extensionVersion: '1.0.0',
			publisherDisplayName: 'VS Code',
			description: localize2('ollamaAgentDescription', "Chat with local Ollama models").value,
			fullName: name.value,
			metadata: {},
			slashCommands: [],
			locations: [location],
			isDefault: true,
			modes: [ChatModeKind.Ask, ChatModeKind.Edit, ChatModeKind.Agent],
			disambiguation: [],
		}));

		this._register(this.chatAgentService.registerAgentImplementation(id, {
			invoke: async (request, progress, history, token) => {
				return this.handleChatRequest(request.message, request.userSelectedModelId, progress, history, token);
			}
		}));
	}

	private async handleChatRequest(
		message: string,
		userSelectedModelId: string | undefined,
		progress: (parts: IChatProgress[]) => void,
		history: IChatAgentHistoryEntry[],
		token: CancellationToken
	): Promise<Record<string, never>> {
		try {
			// Find the model to use
			const modelId = userSelectedModelId || this.findDefaultOllamaModel();
			if (!modelId) {
				progress([{
					kind: 'markdownContent',
					content: new MarkdownString('No Ollama model available. Please connect to Ollama first using "Connect to Ollama" from the model picker.')
				}]);
				return {};
			}

			this.logService.info(`[Ollama Agent] Sending request to model: ${modelId}`);

			// Build messages from history + current request
			const messages: IChatMessage[] = [];

			// Add system message
			messages.push({
				role: ChatMessageRole.System,
				content: [{ type: 'text', value: 'You are a helpful coding assistant running locally via Ollama. Help the user with their coding tasks.' }]
			});

			// Add history
			for (const entry of history) {
				messages.push({
					role: ChatMessageRole.User,
					content: [{ type: 'text', value: entry.request.message }]
				});
				if (entry.response.length > 0) {
					const responseText = entry.response
						.map(r => 'value' in r && typeof r.value === 'string' ? r.value : '')
						.filter(Boolean)
						.join('');
					if (responseText) {
						messages.push({
							role: ChatMessageRole.Assistant,
							content: [{ type: 'text', value: responseText }]
						});
					}
				}
			}

			// Add current message
			messages.push({
				role: ChatMessageRole.User,
				content: [{ type: 'text', value: message }]
			});

			const extensionId = new ExtensionIdentifier('vscode.ollama');

			// Send request to the language model
			const response = await this.languageModelsService.sendChatRequest(
				modelId,
				extensionId,
				messages,
				{},
				token
			);

			// Stream the response - send only deltas (new text chunks)
			let hasContent = false;
			for await (const parts of response.stream) {
				if (token.isCancellationRequested) {
					break;
				}

				const partArray = Array.isArray(parts) ? parts : [parts];
				for (const part of partArray) {
					if (part.type === 'text' && part.value) {
						hasContent = true;
						progress([{
							kind: 'markdownContent',
							content: new MarkdownString(part.value)
						}]);
					}
				}
			}

			if (!hasContent && !token.isCancellationRequested) {
				progress([{
					kind: 'markdownContent',
					content: new MarkdownString('No response received from Ollama model.')
				}]);
			}

		} catch (error) {
			this.logService.error('[Ollama Agent] Error:', error);
			progress([{
				kind: 'markdownContent',
				content: new MarkdownString(`Error: ${error instanceof Error ? error.message : String(error)}`)
			}]);
		}

		return {};
	}

	private findDefaultOllamaModel(): string | undefined {
		const modelIds = this.languageModelsService.getLanguageModelIds();
		// Find first Ollama model
		return modelIds.find(id => id.startsWith('ollama:'));
	}
}
