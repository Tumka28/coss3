# Ollama Integration for VS Code

## Overview

Ollama local language models are now integrated into VS Code's chat interface. You can connect to your local Ollama instance and use any installed models directly in the chat.

## Prerequisites

1. Install Ollama from https://ollama.com
2. Make sure Ollama is running (default: `http://localhost:11434`)
3. Pull some models (e.g., `ollama pull llama3` or `ollama pull codellama`)

## Features

### 1. Auto-Connect on Startup
The Ollama service automatically tries to connect to your local Ollama instance when VS Code starts. If Ollama is running, all available models will be loaded automatically.

### 2. Model Picker Integration
In the chat interface, click the model picker dropdown to see:
- **Connect to Ollama** - Connect to your local Ollama instance
- **Refresh Ollama Models** - Reload the list of available models
- All your local Ollama models under "Local Models" category

### 3. Commands Available

#### Connect to Ollama
- Command: `workbench.action.chat.connectOllama`
- Opens a dialog to configure the Ollama endpoint
- Tests the connection and loads available models

#### Refresh Ollama Models  
- Command: `workbench.action.chat.refreshOllamaModels`
- Reloads the list of models from your Ollama instance

## Usage

### Basic Usage

1. Start Ollama: `ollama serve` (if not already running)
2. Open VS Code
3. Click the chat model picker in the chat panel
4. Click "Connect to Ollama" 
5. Confirm or change the endpoint (default: `http://localhost:11434`)
6. Your Ollama models will appear in the dropdown under "Local Models"
7. Select a model and start chatting!

### Custom Endpoint

If Ollama is running on a different port or remote server:

1. Click "Connect to Ollama"
2. Enter your custom endpoint (e.g., `http://192.168.1.100:11434`)
3. The endpoint is saved and will be used for future connections

### Troubleshooting

**Models not showing up:**
- Make sure Ollama is running: `ollama serve`
- Check you have models installed: `ollama list`
- Click "Refresh Ollama Models" in the model picker

**Connection failed:**
- Verify Ollama is running on the specified endpoint
- Check firewall settings if using a remote endpoint
- Try accessing `http://localhost:11434/api/tags` in your browser

**Model not responding:**
- Check Ollama logs
- Try the model directly with: `ollama run <model-name>`
- Some models may require more memory/resources

## Architecture

### Files Changed/Added

1. **ollamaLanguageModels.ts** - Main service for Ollama integration
   - Fetches models from Ollama API
   - Registers models with VS Code's language model service
   - Handles streaming chat responses

2. **actions/ollamaActions.ts** - Commands for connecting and refreshing
   - Connect to Ollama command
   - Refresh models command

3. **modelPickerActionItem.ts** - Modified to add Ollama buttons
   - "Connect to Ollama" button
   - "Refresh Ollama Models" button

4. **chat.contribution.ts** - Registration
   - Imports and registers Ollama service as workbench contribution

## API Endpoints Used

- `GET /api/tags` - List all available models
- `POST /api/chat` - Send chat messages (with streaming)

## Model Metadata

Each Ollama model is registered with:
- **ID**: `ollama-{model-name}`
- **Vendor**: Ollama
- **Category**: Local Models
- **Family**: Extracted from model details
- **Max Input Tokens**: 4096 (configurable)
- **Max Output Tokens**: 2048 (configurable)

## Next Steps

To rebuild and test:

```bash
# Watch for changes (should already be running)
npm run watch

# Or compile once
npm run compile

# Run VS Code
.\scripts\code.bat
```

The changes will be automatically compiled by the watch process.
