import React, { useState, useEffect } from 'react';
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
import { MessageInput } from './components/MessageInput';
import { apiService, type ChatMessage } from './services/api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Model management state
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('deepseek-r1:7b');
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
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ChatHeader 
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          isLoadingModels={isLoadingModels}
        />
        
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
          <MessageList messages={messages} isLoading={isLoading} />
          <MessageInput 
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