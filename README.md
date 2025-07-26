# AI Chat Application

A modern ChatGPT-style interface for locally-hosted open source language models using Ollama. Features a React frontend with Material-UI and an Express backend for seamless AI conversations.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Ollama](https://ollama.ai/) installed and running

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chatapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Ollama**

   ```bash
   # Start Ollama service
   ollama serve

   # Pull your preferred models (in another terminal)
   ollama pull deepseek-r1:7b
   ollama pull llama3.2:3b
   ollama pull mistral:7b
   ```

4. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start both:
   - Backend server on http://localhost:3001
   - Frontend app on http://localhost:5173

5. **Open your browser** and navigate to http://localhost:5173

## 🏗️ Project Structure

This is a monorepo containing two main packages:

```
chatapp/
├── frontend/          # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/    # Chat UI components
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript interfaces
│   │   └── App.tsx        # Main application
│   └── package.json
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Ollama integration
│   │   └── server.ts      # Express server
│   └── package.json
└── package.json       # Root workspace configuration
```

## 📜 Available Scripts

### Root Level (runs both frontend and backend)

```bash
npm run dev          # Start both development servers
npm run build        # Build both frontend and backend
npm run lint         # Lint all TypeScript files
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Frontend Only

```bash
npm run dev --workspace=frontend    # Start frontend dev server
npm run build --workspace=frontend  # Build for production
npm run preview --workspace=frontend # Preview production build
```

### Backend Only

```bash
npm run dev --workspace=backend     # Start backend dev server
npm run build --workspace=backend   # Compile TypeScript
npm run start --workspace=backend   # Run compiled backend
```

## 🔧 Configuration

### Environment Variables

Create these files if you need custom configuration:

**backend/.env**

```env
PORT=3001
OLLAMA_BASE_URL=http://localhost:11434
```

**frontend/.env**

```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🤖 Supported AI Models

The app works with any Ollama-compatible model. Popular choices:

- **deepseek-r1:7b** - Advanced reasoning capabilities
- **llama3.2:3b** - Fast and efficient
- **mistral:7b** - Excellent general performance
- **qwen2.5:7b** - Strong coding abilities

Install models with:

```bash
ollama pull <model-name>
```

## 🎯 Features

- ✅ **Multi-turn conversations** with full context
- ✅ **Real-time messaging** with loading states
- ✅ **Multiple AI models** with easy switching
- ✅ **Modern dark theme** Material-UI interface
- ✅ **Responsive design** for all screen sizes
- ✅ **TypeScript** throughout for type safety

## 🛠️ Development

### Tech Stack

- **Frontend**: React 19, TypeScript, Material-UI, Vite
- **Backend**: Node.js, Express, TypeScript
- **AI**: Ollama API integration
- **Development**: Hot reload, ESLint, Prettier

### API Endpoints

- `GET /health` - Server health check
- `GET /health/ollama` - Ollama connection status
- `POST /api/chat` - Send chat messages
- `GET /api/chat/models` - List available models

### Adding New Features

1. Frontend components go in `frontend/src/components/`
2. Backend routes go in `backend/src/routes/`
3. Shared types can be added to `frontend/src/types/`
4. API services go in `frontend/src/services/`

## 🚧 Troubleshooting

### Common Issues

**Ollama not connecting:**

```bash
# Ensure Ollama is running
ollama serve

# Check if models are installed
ollama list
```

**Port conflicts:**

- Backend default: 3001
- Frontend default: 5173
- Ollama default: 11434

**Build errors:**

```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```
