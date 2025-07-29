import { useState, useEffect, useRef } from 'react';
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
import { apiService } from './services/api';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messageInputRef = useRef<MessageInputRef>(null);

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState(
    import.meta.env.VITE_DEFAULT_MODEL || 'llama3.2:3b'
  );
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

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    await apiService.sendMessageStream(
      message,
      messages,
      selectedModel,
      conversationId,
      (token) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + token,
          };
          return updated;
        });
      },
      (receivedConversationId) => {
        setConversationId(receivedConversationId);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        console.error('Streaming error:', error);
        setError(`Streaming failed: ${error}`);
      }
    );
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

        <Container
          maxWidth="md"
          sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}
        >
          <MessageList
            messages={messages}
            selectedModel={selectedModel}
            isLoading={isLoading}
          />
          <MessageInput
            ref={messageInputRef}
            value={input}
            onChange={setInput}
            onSend={() => handleSendMessage(input)}
            isLoading={isLoading}
          />
        </Container>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
