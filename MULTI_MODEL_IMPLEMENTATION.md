# VS Code Multi-Model Support Implementation

## Overview

Энэ өөрчлөлт нь VS Code-д олон AI загварыг янз бүрийн функц (chat, debug, tasks, files, extensions, agents) дээр сонгох, ашиглах боломжийг нэмсэн.

## Нэмэгдсэн файлууд

### 1. Core Services

#### `multiModelContext.ts`
**Байршил**: `src/vs/workbench/contrib/chat/common/multiModelContext.ts`

Энэ нь multi-model context-ийн үндсэн үйлчилгээ:
- `IMultiModelContextService` - янз бүрийн feature context-үүдэд загвар сонгох, хадгалах
- `ModelFeatureContext` enum - Chat, Debug, Tasks, Files, Extensions, Agents, Terminal, Notebook
- `IModelContextPreferences` - feature бүрийн тохиргоо
- Storage scope: Profile (хэрэглэгч бүрийн тохиргоо)

**Гол функцууд**:
- `getModelForContext(context)` - context-д сонгогдсон загварыг авах
- `setModelForContext(context, modelId)` - загвар сонгох
- `resolveModelForContext(context)` - fallback-тай хамт хамгийн сайн загварыг олох
- `addToRecentModels(context, modelId)` - сүүлд ашигласан загваруудыг хадгалах

### 2. Actions (Команд үйлдлүүд)

#### `multiModelActions.ts`
**Байршил**: `src/vs/workbench/contrib/chat/browser/actions/multiModelActions.ts`

Feature бүрт загвар сонгох үйлдлүүд:
- `SelectChatModelAction` - Chat-д загвар сонгох
- `SelectDebugModelAction` - Debug-д загвар сонгох
- `SelectTasksModelAction` - Tasks-д загвар сонгох
- `SelectFilesModelAction` - Files-д загвар сонгох
- `SelectAgentsModelAction` - Agents-д загвар сонгох
- `SelectInlineChatModelAction` - Inline chat-д загвар сонгох
- `ShowModelConfigurationAction` - Бүх context-ийн тохиргоог харах
- `ResetModelPreferencesAction` - Тохиргоог reset хийх

Бүх үйлдэл F1 command palette дээр бий.

### 3. Feature-Specific AI Services

#### `debugAIAssistant.ts`
**Байршил**: `src/vs/workbench/contrib/debug/common/debugAIAssistant.ts`

Debug-ийн AI туслагч:
- `askAssistant(request, token)` - debug context дээр асуулт асуух
- `explainError(errorMessage, context, token)` - алдааг тайлбарлах
- `suggestFixes(issue, context, token)` - засварын санал өгөх

#### `taskAIService.ts`
**Байршил**: `src/vs/workbench/contrib/tasks/common/taskAIService.ts`

Task-ийн AI үйлчилгээ:
- `generateTask(request, token)` - байгалийн хэлнээс task үүсгэх
- `analyzeTaskOutput(output, originalTask, token)` - task-ийн output шинжлэх
- `fixFailedTask(taskDescription, error, token)` - алдаатай task засах

#### `fileOperationAIService.ts`
**Байршил**: `src/vs/workbench/contrib/files/common/fileOperationAIService.ts`

File үйлдлийн AI:
- `suggestFileOperations(request, token)` - файлын үйлдэл санал болгох
- `suggestBetterNames(files, purpose, token)` - файлын нэр сайжруулах
- `analyzeFileStructure(rootPath, token)` - project бүтцийг шинжлэх

### 4. Extension API

#### `vscode.proposed.multiModelContext.d.ts`
**Байршил**: `src/vscode-dts/vscode.proposed.multiModelContext.d.ts`

Extension-уудад зориулсан API:
```typescript
export namespace lm {
    export enum ModelFeatureContext { ... }
    export function getLanguageModelForContext(context): Thenable<LanguageModelChat | undefined>;
    export function selectLanguageModelsForContext(context, selector?): Thenable<LanguageModelChat[]>;
    export function setLanguageModelForContext(context, model): Thenable<void>;
    export const onDidChangeModelForContext: Event<...>;
}
```

#### `extHostMultiModelContext.ts`
**Байршил**: `src/vs/workbench/api/common/extHostMultiModelContext.ts`

Extension host талын implementation.

#### `mainThreadMultiModelContext.ts`
**Байршил**: `src/vs/workbench/api/browser/mainThreadMultiModelContext.ts`

Main thread талын implementation.

## Өөрчлөгдсөн файлууд

### `chat.contribution.ts`
- `IMultiModelContextService` бүртгэгдсэн
- `registerMultiModelActions()` дуудагдсан

### `debug.contribution.ts`
- `IDebugAIAssistantService` бүртгэгдсэн

### `extHost.protocol.ts`
- `MainThreadMultiModelContext` proxy нэмэгдсэн
- `ExtHostMultiModelContext` proxy нэмэгдсэн
- Shape интерфейсүүд нэмэгдсэн

## Хэрэглээ

### 1. Програмчлалаар загвар сонгох

```typescript
// Extension-д
import * as vscode from 'vscode';

// Debug-д загвар сонгох
const models = await vscode.lm.selectLanguageModelsForContext(
    vscode.lm.ModelFeatureContext.Debug,
    { vendor: 'copilot', family: 'gpt-4' }
);

if (models.length > 0) {
    await vscode.lm.setLanguageModelForContext(
        vscode.lm.ModelFeatureContext.Debug,
        models[0]
    );
}
```

### 2. Командын хэрэглээ

F1 (Command Palette) дараад:
- "Select Chat Model" - Chat-ийн загвар сонгох
- "Select Debug Assistant Model" - Debug-ийн загвар сонгох
- "Select Tasks AI Model" - Tasks-ийн загвар сонгох
- "Select File Operations AI Model" - Files-ийн загвар сонгох
- "Select Agents Model" - Agents-ийн загвар сонгох
- "Select Inline Chat Model" - Inline chat-ийн загвар сонгох
- "Show Model Configuration" - Бүх тохиргоог харах
- "Reset Model Preferences" - Тохиргоог цэвэрлэх

### 3. Service ашиглах

```typescript
// Debug AI Assistant
const debugAI = accessor.get(IDebugAIAssistantService);
const response = await debugAI.askAssistant({
    context: 'function foo() { ... }',
    query: 'Why is this function not working?',
    errorMessage: 'TypeError: Cannot read property...'
}, token);

console.log(response.text);
console.log(response.suggestions);

// Task AI
const taskAI = accessor.get(ITaskAIService);
const task = await taskAI.generateTask({
    taskDescription: 'Build and test the project',
    workspaceContext: '/path/to/project'
}, token);

console.log(task.command);
console.log(task.explanation);

// File Operations AI
const fileAI = accessor.get(IFileOperationAIService);
const suggestions = await fileAI.suggestBetterNames(
    [URI.file('/path/to/temp.js')],
    'utility functions',
    token
);
```

## Storage & Configuration

### Storage Keys
- `multiModel.context.{context}` - feature бүрийн тохиргоо (Profile scope)
- Жишээ: `multiModel.context.debug`, `multiModel.context.tasks`

### Preferences Structure
```typescript
{
    modelId: string | undefined;
    useCustomModel: boolean | undefined;
    recentModels: string[] | undefined;  // max 5
    fallbackModelId: string | undefined;
}
```

## Model Selection Algorithm

1. Custom model сонгогдсон бол -> түүнийг ашиглах
2. Fallback model байвал -> түүнийг ашиглах
3. Context-д тохирсон default -> feature-ийн онцлогт тохирсон загвар
4. Хамгийн эхний байгаа загвар

Context бүрийн онцлог:
- **Chat**: `isDefaultForLocation.panel === true`
- **EditorInline**: `isDefaultForLocation.editor === true`
- **Debug/Tasks/Files**: tool calling чадвартай (`capabilities.toolCalling === true`)
- **Agents**: agent mode (`capabilities.agentMode && toolCalling`)

## Events

### `onDidChangeModelForContext`
Context-ийн загвар өөрчлөгдөхөд:
```typescript
multiModelContextService.onDidChangeModelForContext(({ context, modelId }) => {
    console.log(`Model for ${context} changed to ${modelId}`);
});
```

## Telemetry (Цаашид нэмэгдэх)

Telemetry event-үүд:
- `multimodel/contextModelChanged` - загвар солигдох
- `multimodel/featureUsage` - feature ашиглалт
- `multimodel/modelPerformance` - загварын гүйцэтгэл

## Testing

Тестлэх:
1. F1 -> "Select Debug Assistant Model" -> загвар сонгох
2. Debug session эхлүүлэх
3. Debug AI Assistant-г дуудах
4. Зөв загвар ашиглагдаж байгааг шалгах

## Next Steps (Цаашдын ажил)

1. Settings UI нэмэх (`chat.model.preferences` settings page)
2. Telemetry бүрэн дэмжих
3. Model performance tracking
4. Context-specific model recommendations
5. Automatic model selection based on task complexity
6. Model cost tracking per feature
7. UI indicators for which model is being used
8. Model comparison tools

## Dependencies

Энэ өөрчлөлт нь дараах үйлчилгээнүүдэд хамаарна:
- `ILanguageModelsService` - загвар удирдлага
- `IStorageService` - тохиргоо хадгалах
- `ILogService` - log бичих
- `IQuickInputService` - UI сонголтууд
