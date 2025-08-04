import { useCallback, useEffect } from 'react';
import { Container, Box, Paper } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ModelSelector } from './ModelSelector';

import useLLMModelOptions from './hooks/useModelOptions';
import useConversationMessaging from './hooks/useConversationMessaging';
import { useNotification } from '../contexts/NotificationContext';

interface ChatInterfaceProps {
  conversationId?: string | null;
}

export function ChatInterface({ conversationId = null }: ChatInterfaceProps) {
  const { notify } = useNotification();
  const models = useLLMModelOptions();
  const conversation = useConversationMessaging(conversationId, notify);
  const navigate = useNavigate();

  useEffect(() => {
    if (conversationId) {
      conversation.loadConversation(conversationId);
    }
  }, [conversationId]);

  const handleMessageSend = useCallback(
    async (msg: string = '') => {
      if (conversationId) {
        conversation.addMessage(msg, models.selected);
      } else {
        const created = await conversation.create(msg);
        if (created) {
          navigate({
            to: '/c/$publicId',
            params: { publicId: created.publicId },
          });
          conversation.addMessage(msg, models.selected);
        }
      }
    },
    [conversationId, models.selected]
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <ModelSelector
            availableModels={models.available}
            selectedModel={models.selected}
            onModelChange={models.setSelected}
            isLoading={models.loading}
          />
        </Paper>
      </Box>
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          minHeight: 0,
        }}
      >
        <MessageList
          messages={conversation.messages}
          selectedModel={models.selected}
          isLoading={conversation.loading}
        />
        <MessageInput
          onSend={handleMessageSend}
          isLoading={conversation.loading}
        />
      </Container>
    </Box>
  );
}
