import { useCallback } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

import useLLMModelOptions from './hooks/useModelOptions';
import useConversationMessaging from './hooks/useConversationMessaging';
import { useNotification } from '../contexts/NotificationContext';

interface ChatInterfaceProps {
  conversationId?: string | null;
}

export function ChatInterface({ conversationId = null }: ChatInterfaceProps) {
  const { notify } = useNotification();
  const models = useLLMModelOptions();
  const conversation = useConversationMessaging(
    conversationId,
    models.selected,
    notify
  );
  const navigate = useNavigate();

  const handleMessageSend = useCallback(
    async (msg: string = '') => {
      if (conversationId) {
        conversation.addMessage(msg);
      } else {
        const created = await conversation.create(msg);
        if (created) {
          navigate({
            to: '/c/$publicId',
            params: { publicId: created.publicId },
          });
          conversation.addMessage(msg);
        }
      }
    },
    [conversationId]
  );

  return (
    <>
      <ChatHeader
        availableModels={models.available}
        selectedModel={models.selected}
        onModelChange={models.setSelected}
        isLoadingModels={models.loading}
      />
      <Container
        maxWidth="md"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}
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
    </>
  );
}
