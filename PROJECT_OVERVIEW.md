# Local AI Chat Application - Project Overview

## Current Status: ✅ FULLY FUNCTIONAL
A working ChatGPT/Claude-style interface for locally-hosted open source language models using Ollama.

## Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Material-UI (MUI) with dark theme
- **Backend**: Node.js + Express + TypeScript  
- **AI Models**: Ollama-hosted models (DeepSeek R1, Llama, Mistral, etc.)
- **API**: RESTful endpoints with JSON communication
- **Development**: Vite (frontend), ts-node (backend)

### Project Structure
```
/Users/pat/Code/chatapp/
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # ChatHeader, MessageList, MessageBubble, MessageInput, ModelSelector
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   └── vite.config.ts
├── backend/                # Express TypeScript server
│   ├── src/
│   │   ├── services/       # OllamaService (API integration)
│   │   ├── routes/         # Express routes (chat, health)
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── tsconfig.json
├── shared/                 # Shared types/utilities (if needed)
├── .claude                 # Detailed task tracking (legacy)
└── PROJECT_OVERVIEW.md     # This file
```

## ✅ Working Features

### Core Chat Functionality
- **Multi-turn conversations** with full context preservation
- **Real-time messaging** with loading states and error handling
- **Message display** with user/assistant message bubbles
- **Responsive UI** that works on different screen sizes

### Model Management 
- **Multiple model support** - dynamically loads available Ollama models
- **Model switching** via dropdown selector in header
- **Model persistence** - remembers selected model across messages
- **Automatic model detection** from Ollama installation

### Technical Implementation
- **Dependency injection** pattern for services
- **Clean separation** of concerns (routes, services, components)
- **TypeScript throughout** with proper interfaces
- **Error handling** with user-friendly messages
- **Environment configuration** via .env files
- **CORS configured** for frontend-backend communication

## API Endpoints

### Backend (Express server on :3001)
- `GET /health` - Server health check
- `GET /health/ollama` - Ollama connection health check  
- `POST /api/chat` - Send chat message with conversation history
- `GET /api/chat/models` - List available Ollama models

### Frontend (Vite dev server on :5173)
- Connects to backend via `VITE_API_BASE_URL` environment variable
- ApiService handles all backend communication

## Key Components

### Frontend Components
- **App.tsx** - Main component with state management
- **ChatHeader** - Title bar with model selector dropdown
- **MessageList** - Scrollable list of conversation messages  
- **MessageBubble** - Individual message styling (user vs assistant)
- **MessageInput** - Text input with send button
- **ModelSelector** - Dropdown for choosing AI models
- **LoadingMessage** - Typing indicator during AI response

### Backend Services
- **OllamaService** - Handles communication with Ollama API
  - `chat(messages, model)` - Send chat request
  - `getAvailableModels()` - List installed models
  - `isHealthy()` - Check Ollama connection

## Data Flow
1. User types message in MessageInput
2. Frontend adds user message to state, calls ApiService
3. ApiService posts to `/api/chat` with message, history, and selected model
4. Backend routes to chat handler, calls OllamaService
5. OllamaService makes request to Ollama API
6. Response flows back: Ollama → Backend → Frontend → UI update

## Development Setup
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm run dev

# Ollama (separate terminal)
ollama serve
ollama pull deepseek-r1:7b  # or other models
```

## Installed Models (Example)
- `deepseek-r1:7b` - Default reasoning model
- `llama3.2:3b` - Fast, efficient
- `mistral:7b` - Excellent performance
- `qwen2.5:7b` - Strong coding abilities

## What's NOT Implemented Yet
- **Streaming responses** (tokens appear as typed)
- **Database persistence** (conversations lost on refresh)
- **Conversation management** (save/load/delete chats)
- **Message editing/regeneration**
- **Settings panel** (temperature, system prompts)
- **Authentication** (single user app)

## Key Design Decisions
- **No database yet** - focusing on core chat functionality first
- **RESTful over WebSocket** - simpler implementation, streaming can be added later
- **MUI dark theme** - modern, professional look
- **TypeScript strict mode** - better developer experience and fewer bugs
- **Monorepo structure** - related frontend/backend in single project
- **Dependency injection** - testable, maintainable service layer

## Development Notes
- Uses Vite for fast frontend development
- Backend auto-reloads with ts-node-dev
- CORS configured for localhost development
- Environment variables for configuration
- Clean error handling throughout stack

## Current Focus Areas
The application is feature-complete for basic AI chat. Next logical steps would be:
1. **Streaming responses** for better UX
2. **Database integration** for conversation persistence  
3. **Advanced model parameters** (temperature, system prompts)
4. **Conversation management UI**

This is a solid foundation for learning modern full-stack development with AI APIs.