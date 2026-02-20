# Multi-Model Support Implementation for VS Code

## Summary

This implementation adds comprehensive multi-model support to VS Code, enabling different AI models to be selected and used across various features including chat, debugging, tasks, file operations, extensions, and agents.

## New Files Created

### 1. Core Services

1. **`src/vs/workbench/contrib/chat/common/multiModelContext.ts`**
   - Core service for managing model selection per feature context
   - Provides `IMultiModelContextService` interface
   - Defines `ModelFeatureContext` enum (Chat, Debug, Tasks, Files, Extensions, Agents, etc.)
   - Handles preferences storage and model resolution

2. **`src/vs/workbench/contrib/chat/common/multiModelTelemetry.ts`**
   - Telemetry service for tracking model usage
   - Logs model changes, feature usage, and performance metrics
   - Provides analytics for model selection patterns

### 2. Feature-Specific AI Services

3. **`src/vs/workbench/contrib/debug/common/debugAIAssistant.ts`**
   - AI assistant for debugging tasks
   - Methods: `askAssistant()`, `explainError()`, `suggestFixes()`
   - Integrates with debug context for error analysis

4. **`src/vs/workbench/contrib/tasks/common/taskAIService.ts`**
   - AI service for task automation
   - Methods: `generateTask()`, `analyzeTaskOutput()`, `fixFailedTask()`
   - Converts natural language to executable commands

5. **`src/vs/workbench/contrib/files/common/fileOperationAIService.ts`**
   - AI for file operations and organization
   - Methods: `suggestFileOperations()`, `suggestBetterNames()`, `analyzeFileStructure()`
   - Helps with file naming and project structure

### 3. UI Actions

6. **`src/vs/workbench/contrib/chat/browser/actions/multiModelActions.ts`**
   - Command palette actions for model selection
   - Individual actions for each feature context
   - `ShowModelConfigurationAction` for viewing all settings
   - `ResetModelPreferencesAction` for clearing preferences

### 4. Extension API

7. **`src/vscode-dts/vscode.proposed.multiModelContext.d.ts`**
   - Proposed API for extension access
   - Adds `vscode.lm.ModelFeatureContext` enum
   - Functions: `getLanguageModelForContext()`, `setLanguageModelForContext()`, etc.
   - Event: `onDidChangeModelForContext`

8. **`src/vs/workbench/api/common/extHostMultiModelContext.ts`**
   - Extension host implementation
   - Handles model selection from extension side

9. **`src/vs/workbench/api/browser/mainThreadMultiModelContext.ts`**
   - Main thread implementation
   - Bridges extension API to core service

### 5. Documentation

10. **`MULTI_MODEL_IMPLEMENTATION.md`**
    - Comprehensive documentation in Mongolian
    - Architecture overview
    - Usage examples
    - API reference

## Modified Files

1. **`src/vs/workbench/contrib/chat/browser/chat.contribution.ts`**
   - Registered `IMultiModelContextService`
   - Added `registerMultiModelActions()` call

2. **`src/vs/workbench/contrib/debug/browser/debug.contribution.ts`**
   - Registered `IDebugAIAssistantService`

3. **`src/vs/workbench/api/common/extHost.protocol.ts`**
   - Added `MainThreadMultiModelContext` proxy
   - Added `ExtHostMultiModelContext` proxy
   - Added shape interfaces for both
   - Imported `ModelFeatureContext`

## Key Features

### 1. Per-Feature Model Selection

Each feature area can have its own model preference:
- **Chat**: Main chat panel/editor
- **Debug**: Debugging assistance
- **Tasks**: Task generation and execution
- **Files**: File operations and organization
- **Extensions**: Extension-initiated requests
- **Agents**: Agent execution
- **EditorInline**: Inline chat
- **Terminal**: Terminal chat
- **Notebook**: Notebook chat

### 2. Model Resolution Algorithm

1. Check for custom model selection
2. Try fallback model if configured
3. Find context-appropriate default
4. Use first available model

### 3. Storage

Preferences stored per feature in profile scope:
- Storage key pattern: `multiModel.context.{context}`
- Contains: modelId, useCustomModel, recentModels (max 5), fallbackModelId

### 4. Command Palette Actions

All accessible via F1:
- `Select Chat Model`
- `Select Debug Assistant Model`
- `Select Tasks AI Model`
- `Select File Operations AI Model`
- `Select Agents Model`
- `Select Inline Chat Model`
- `Show Model Configuration`
- `Reset Model Preferences`

### 5. Extension API

Extensions can:
- Query current model for a context
- Select models for a specific context
- Set preferred model for a context
- Listen to model changes

### 6. Telemetry

Tracks:
- Model changes per context
- Feature usage patterns
- Model performance metrics
- Error rates by model

## Usage Examples

### From Extensions

```typescript
import * as vscode from 'vscode';

// Get current debug model
const model = await vscode.lm.getLanguageModelForContext(
    vscode.lm.ModelFeatureContext.Debug
);

// Select and set a model
const models = await vscode.lm.selectLanguageModelsForContext(
    vscode.lm.ModelFeatureContext.Tasks,
    { vendor: 'copilot', family: 'gpt-4' }
);

if (models.length > 0) {
    await vscode.lm.setLanguageModelForContext(
        vscode.lm.ModelFeatureContext.Tasks,
        models[0]
    );
}

// Listen for changes
vscode.lm.onDidChangeModelForContext(({ context, model }) => {
    console.log(`Model for ${context} changed`);
});
```

### From VS Code Internals

```typescript
// Using Debug AI Assistant
const debugAI = accessor.get(IDebugAIAssistantService);
const response = await debugAI.askAssistant({
    context: 'Stack trace...',
    query: 'Why is this failing?',
    errorMessage: 'TypeError...'
}, token);

// Using Task AI
const taskAI = accessor.get(ITaskAIService);
const task = await taskAI.generateTask({
    taskDescription: 'Build the project',
    workspaceContext: '/path/to/project'
}, token);

// Using File Operations AI
const fileAI = accessor.get(IFileOperationAIService);
const names = await fileAI.suggestBetterNames(
    [URI.file('/path/to/file.js')],
    'utility functions',
    token
);
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Extension API                       │
│  (vscode.lm.ModelFeatureContext methods)            │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│          ExtHost / MainThread Bridge                 │
│  (extHostMultiModelContext + mainThreadMulti...)    │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│        IMultiModelContextService (Core)              │
│  - Model selection per context                      │
│  - Preferences storage                              │
│  - Model resolution                                 │
└────────┬────────────────────────────────────────────┘
         │
         ├──────────┬──────────┬──────────┬───────────┐
         ▼          ▼          ▼          ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │DebugAI │ │TaskAI  │ │FileAI  │ │ChatAI  │ │AgentAI │
    └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
         │          │          │          │           │
         └──────────┴──────────┴──────────┴───────────┘
                              │
                              ▼
                  ┌────────────────────┐
                  │ ILanguageModelsService │
                  │  (Existing service)    │
                  └────────────────────┘
```

## Testing

To test the implementation:

1. **Build VS Code** (compilation should succeed)
2. **Run VS Code** in debug mode
3. **Open Command Palette** (F1)
4. **Try commands**:
   - "Select Debug Assistant Model"
   - "Select Tasks AI Model"
   - etc.
5. **Verify** that models appear and can be selected
6. **Check storage** in developer tools: Application > Local Storage > look for `multiModel.context.*` keys

## Next Steps

1. **UI Polish**
   - Add model indicators in relevant views
   - Show which model is currently selected
   - Add quick-switch buttons

2. **Documentation**
   - Add user documentation
   - Create video tutorials
   - Update API docs

3. **Analytics**
   - Monitor model usage patterns
   - Track performance metrics
   - Optimize default selections

4. **Features**
   - Smart model recommendations
   - Cost tracking per feature
   - Model comparison tools
   - Automatic model selection based on task complexity

## Dependencies

This implementation requires:
- `ILanguageModelsService` (existing)
- `IStorageService` (existing)
- `ILogService` (existing)
- `IQuickInputService` (existing)
- `ITelemetryService` (existing)

## Breaking Changes

None. This is purely additive functionality.

## Compatibility

- Works with all existing language model providers
- Compatible with current chat/agent infrastructure
- Extensions using proposed API need to enable: `"enabledApiProposals": ["multiModelContext"]`

## License

Same as VS Code (MIT License)
