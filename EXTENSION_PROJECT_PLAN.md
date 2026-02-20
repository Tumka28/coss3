# 🚀 VS Code Multi-Agent Chat Extension Project Plan

## 🎯 Зорилго

VS Code extension бүтээх:
- ✅ Ollama integration (local open source models)
- ✅ Multi-agent system
- ✅ Chat UI
- ✅ Open source models дэмжлэг
- ✅ Model switching & configuration

---

## 📦 Extension Architecture

### Project Structure

```
vscode-multi-agent-chat/
├── package.json                 # Extension manifest
├── tsconfig.json               # TypeScript config
├── src/
│   ├── extension.ts            # Extension entry point
│   ├── chat/
│   │   ├── chatProvider.ts     # Chat webview provider
│   │   ├── chatPanel.ts        # Chat UI management
│   │   └── chatHistory.ts      # Chat history storage
│   ├── models/
│   │   ├── modelManager.ts     # Model registry & switching
│   │   ├── ollamaProvider.ts   # Ollama integration
│   │   ├── openaiProvider.ts   # OpenAI compatible API
│   │   ├── anthropicProvider.ts # Claude API
│   │   └── baseProvider.ts     # Base model provider interface
│   ├── agents/
│   │   ├── agentManager.ts     # Multi-agent coordination
│   │   ├── agentTypes.ts       # Agent definitions
│   │   ├── taskRouter.ts       # Route tasks to agents
│   │   └── agentCommunication.ts # Agent-to-agent communication
│   ├── ui/
│   │   ├── webview/
│   │   │   ├── chat.html       # Chat UI
│   │   │   ├── chat.css        # Styles
│   │   │   └── chat.js         # Frontend logic
│   │   └── components/
│   │       ├── modelSelector.ts # Model picker UI
│   │       └── agentSelector.ts # Agent picker UI
│   └── utils/
│       ├── config.ts           # Extension configuration
│       ├── logger.ts           # Logging
│       └── api.ts              # HTTP client utilities
└── resources/
    └── icons/                  # Extension icons
```

---

## 🔧 Core Features

### 1. Ollama Integration

**Features:**
- Local model discovery
- Model pull/download
- Streaming chat responses
- Context management
- Token usage tracking

**API Endpoints:**
```typescript
// Ollama API базовая структура
interface OllamaAPI {
  // List available models
  GET /api/tags
  
  // Generate response
  POST /api/generate {
    model: string,
    prompt: string,
    stream: boolean
  }
  
  // Chat completion
  POST /api/chat {
    model: string,
    messages: Message[],
    stream: boolean
  }
  
  // Pull model
  POST /api/pull {
    name: string
  }
}
```

### 2. Multi-Agent System

**Agent Types:**
```typescript
enum AgentRole {
  CODER = "coder",           // Code generation
  DEBUGGER = "debugger",     // Bug fixing
  REVIEWER = "reviewer",     // Code review
  TESTER = "tester",        // Test generation
  DOCUMENTER = "documenter", // Documentation
  ARCHITECT = "architect",   // System design
  GENERAL = "general"        // General purpose
}

interface Agent {
  id: string;
  role: AgentRole;
  modelId: string;
  systemPrompt: string;
  capabilities: string[];
  priority: number;
}
```

**Multi-Agent Coordination:**
```typescript
class AgentManager {
  // Route task to appropriate agent
  routeTask(task: Task): Agent;
  
  // Create agent team for complex tasks
  createTeam(task: ComplexTask): Agent[];
  
  // Coordinate multi-step execution
  async executeWithTeam(task: ComplexTask): Promise<Result>;
  
  // Agent communication
  async agentConversation(agents: Agent[], context: Context): Promise<void>;
}
```

### 3. Chat UI (Webview)

**Features:**
- Message history
- Streaming responses
- Code blocks with syntax highlighting
- Copy to clipboard
- Insert at cursor
- Model switcher
- Agent switcher
- Context awareness (current file, selection)

### 4. Model Providers

**Supported Providers:**

```typescript
interface ModelProvider {
  id: string;
  name: string;
  type: "ollama" | "openai" | "anthropic" | "custom";
  baseURL: string;
  apiKey?: string;
  
  // List available models
  listModels(): Promise<Model[]>;
  
  // Send chat request
  chat(messages: Message[], options: ChatOptions): AsyncIterable<string>;
  
  // Check availability
  isAvailable(): Promise<boolean>;
}
```

**Provider Types:**
1. **Ollama** (local)
2. **OpenAI** compatible APIs
3. **Anthropic Claude**
4. **Custom endpoints**

---

## 🎨 User Interface

### Commands (F1 → Command Palette)

```
> Multi-Agent: Open Chat
> Multi-Agent: Select Model
> Multi-Agent: Select Agent
> Multi-Agent: Pull Ollama Model
> Multi-Agent: List Available Models
> Multi-Agent: Configure Providers
> Multi-Agent: Clear Chat History
> Multi-Agent: Export Conversation
```

### Chat Panel Layout

```
┌─────────────────────────────────────┐
│ Model: llama3.2   Agent: Coder   [⚙]│
├─────────────────────────────────────┤
│                                     │
│ User: How do I create a function?  │
│                                     │
│ Assistant: Here's how to create... │
│ ```typescript                       │
│ function example() { }              │
│ ```                                 │
│ [Copy] [Insert at Cursor]          │
│                                     │
├─────────────────────────────────────┤
│ Type your message...           [Send]│
└─────────────────────────────────────┘
```

### Settings UI

```json
{
  "multiAgent.ollama.baseURL": "http://localhost:11434",
  "multiAgent.ollama.defaultModel": "llama3.2",
  "multiAgent.openai.apiKey": "",
  "multiAgent.anthropic.apiKey": "",
  "multiAgent.agents.enabled": true,
  "multiAgent.agents.autoRoute": true,
  "multiAgent.chat.streaming": true,
  "multiAgent.chat.contextLines": 100
}
```

---

## 📋 Implementation Steps

### Phase 1: Basic Extension Setup (30 минут)
- [ ] Create extension scaffold (`yo code`)
- [ ] Setup TypeScript configuration
- [ ] Create basic file structure
- [ ] Setup build process

### Phase 2: Ollama Integration (1-2 цаг)
- [ ] Implement Ollama API client
- [ ] Model discovery & listing
- [ ] Chat completion with streaming
- [ ] Error handling & retries

### Phase 3: Chat UI (2-3 цаг)
- [ ] Create webview provider
- [ ] Design chat interface (HTML/CSS)
- [ ] Message rendering
- [ ] Code syntax highlighting
- [ ] Streaming response display

### Phase 4: Model Management (1 цаг)
- [ ] Model provider interface
- [ ] Multiple provider support
- [ ] Model switching UI
- [ ] Provider configuration

### Phase 5: Multi-Agent System (2-3 цаг)
- [ ] Agent definitions
- [ ] Task routing logic
- [ ] Agent coordination
- [ ] Multi-agent conversation

### Phase 6: Commands & Integration (1 цаг)
- [ ] Command palette commands
- [ ] Context menu items
- [ ] Keybindings
- [ ] Status bar integration

### Phase 7: Testing & Polish (1-2 цаг)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Error handling
- [ ] Documentation

---

## 🔌 Dependencies

```json
{
  "dependencies": {
    "axios": "^1.6.0",          // HTTP client
    "marked": "^11.0.0",        // Markdown parsing
    "highlight.js": "^11.9.0"   // Syntax highlighting
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "esbuild": "^0.19.0"
  }
}
```

---

## 🚀 Quick Start Timeline

**Total Time: ~8-12 hours**

1. **Hour 1-2**: Extension setup + Ollama integration
2. **Hour 3-5**: Chat UI development
3. **Hour 6-7**: Model management
4. **Hour 8-10**: Multi-agent system
5. **Hour 11-12**: Testing & polish

---

## 📝 Next Steps

**Одоо эхлүүлэх үү?**

1. Шинэ extension project folder үүсгэх
2. Extension scaffold generate хийх
3. Ollama integration эхлүүлэх
4. Chat UI бүтээх
5. Multi-agent system нэмэх

---

**Эхлүүлэх үү? 🚀**
