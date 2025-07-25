import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Snackbar,
} from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { Message } from './types/chat';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput, type MessageInputRef } from './components/MessageInput';
import { apiService, type ChatMessage } from './services/api';

const frappeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8caaee',
      dark: '#737994',
      light: '#99d1db',
      contrastText: '#c6d0f5',
    },
    secondary: {
      main: '#ca9ee6',
      dark: '#838ba7',
      light: '#f4b8e4',
    },
    background: {
      default: '#303446',
      paper: '#414559',
    },
    surface: {
      main: '#51576d',
    },
    text: {
      primary: '#c6d0f5',
      secondary: '#b5bfe2',
    },
    error: {
      main: '#e78284',
    },
    warning: {
      main: '#e5c890',
    },
    info: {
      main: '#85c1dc',
    },
    success: {
      main: '#a6d189',
    },
    grey: {
      50: '#c6d0f5',
      100: '#b5bfe2',
      200: '#a5adce',
      300: '#949cbb',
      400: '#838ba7',
      500: '#737994',
      600: '#626880',
      700: '#51576d',
      800: '#414559',
      900: '#303446',
    },
  },
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageInputRef = useRef<MessageInputRef>(null);
  
  // Model management state
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState(import.meta.env.VITE_DEFAULT_MODEL || 'llama3.2:3b');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        const models = await apiService.getAvailableModels();
        setAvailableModels(models);
        
        if (models.length > 0 && !models.includes(selectedModel)) {
          setSelectedModel(models[0]);
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        setError('Failed to load available models');
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, [selectedModel]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Pass the selected model to the API
      const response = await apiService.sendMessage(input, conversationHistory, selectedModel);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
      // Refocus the input after the message is sent
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 0);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={frappeTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ChatHeader 
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          isLoadingModels={isLoadingModels}
        />
        
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
          <MessageList messages={messages} isLoading={isLoading} selectedModel={selectedModel} />
          <MessageInput 
            ref={messageInputRef}
            value={input}
            onChange={setInput}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </Container>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;