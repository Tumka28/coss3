/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IOllamaLanguageModelsService } from '../ollamaLanguageModels.js';
import { ILogService } from '../../../../../platform/log/common/log.js';

export const CONNECT_OLLAMA_COMMAND_ID = 'workbench.action.chat.connectOllama';
export const REFRESH_OLLAMA_MODELS_COMMAND_ID = 'workbench.action.chat.refreshOllamaModels';

class ConnectOllamaAction extends Action2 {
	constructor() {
		super({
			id: CONNECT_OLLAMA_COMMAND_ID,
			title: { value: localize('connectOllama', "Connect to Ollama"), original: 'Connect to Ollama' },
			f1: true,
			category: { value: localize('chat', "Chat"), original: 'Chat' }
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const notificationService = accessor.get(INotificationService);
		const ollamaService = accessor.get(IOllamaLanguageModelsService);
		const logService = accessor.get(ILogService);

		const currentEndpoint = ollamaService.getEndpoint();

		// First, try to connect with the current endpoint silently
		logService.info(`[Ollama] Trying to connect to ${currentEndpoint}`);

		const isConnected = await ollamaService.testConnection();

		if (isConnected) {
			// Connection successful, fetch/refresh models
			notificationService.status(localize('ollama.fetchingModels', "Fetching Ollama models..."), { hideAfter: 2000 });
			try {
				await ollamaService.fetchAndRegisterModels();
				notificationService.info(localize('ollama.connected', "Successfully connected to Ollama and loaded models!"));
				logService.info(`[Ollama] Successfully connected to ${currentEndpoint}`);
				return;
			} catch (error) {
				logService.warn('[Ollama] Fetch models failed:', error);
				// Fall through to show input box
			}
		}

		// If connection failed, show input box for custom endpoint
		const endpoint = await quickInputService.input({
			prompt: localize('ollama.endpoint.prompt', "Enter Ollama API endpoint"),
			value: currentEndpoint,
			placeHolder: 'http://localhost:11434',
			validateInput: async (value) => {
				if (!value) {
					return localize('ollama.endpoint.required', "Endpoint is required");
				}
				try {
					new URL(value);
					return undefined;
				} catch {
					return localize('ollama.endpoint.invalid', "Invalid URL format");
				}
			}
		});

		if (!endpoint) {
			return;
		}

		// Update endpoint and try to connect
		ollamaService.setEndpoint(endpoint);
		notificationService.status(localize('ollama.testing', "Testing Ollama connection..."), { hideAfter: 2000 });

		try {
			const newConnected = await ollamaService.testConnection();

			if (!newConnected) {
				notificationService.error(localize('ollama.connection.failed', "Failed to connect to Ollama at {0}. Make sure Ollama is running.", endpoint));
				return;
			}

			notificationService.status(localize('ollama.fetchingModels', "Fetching Ollama models..."), { hideAfter: 2000 });
			await ollamaService.fetchAndRegisterModels();
			notificationService.info(localize('ollama.connected', "Successfully connected to Ollama and loaded models!"));
			logService.info(`[Ollama] Successfully connected to ${endpoint}`);

		} catch (error) {
			notificationService.error(localize('ollama.error', "Error connecting to Ollama: {0}", String(error)));
			logService.error('[Ollama] Connection error:', error);
		}
	}
}

class RefreshOllamaModelsAction extends Action2 {
	constructor() {
		super({
			id: REFRESH_OLLAMA_MODELS_COMMAND_ID,
			title: { value: localize('refreshOllamaModels', "Refresh Ollama Models"), original: 'Refresh Ollama Models' },
			f1: true,
			category: { value: localize('chat', "Chat"), original: 'Chat' }
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const notificationService = accessor.get(INotificationService);
		const ollamaService = accessor.get(IOllamaLanguageModelsService);
		const logService = accessor.get(ILogService);

		try {
			notificationService.status(localize('ollama.refreshing', "Refreshing Ollama models..."), { hideAfter: 2000 });

			await ollamaService.fetchAndRegisterModels();

			notificationService.info(localize('ollama.refreshed', "Ollama models refreshed successfully!"));
			logService.info('[Ollama] Models refreshed');

		} catch (error) {
			notificationService.error(localize('ollama.refresh.error', "Error refreshing Ollama models: {0}", String(error)));
			logService.error('[Ollama] Refresh error:', error);
		}
	}
}

registerAction2(ConnectOllamaAction);
registerAction2(RefreshOllamaModelsAction);
