import React, { useState } from 'react';
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
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
      // Convert messages to API format
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await apiService.sendMessage(input, conversationHistory);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Add proper error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ChatHeader modelName="DeepSeek R1" />
        
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
          <MessageList messages={messages} isLoading={isLoading} />
          <MessageInput 
            value={input}
            onChange={setInput}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;