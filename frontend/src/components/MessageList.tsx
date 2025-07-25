import React from 'react';
import { Paper, List, ListItem, Typography } from '@mui/material';
import type { Message } from '../types/chat';
import { MessageBubble } from './MessageBubble';
import { LoadingMessage } from './LoadingMessage';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  selectedModel: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  selectedModel,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 1,
        }}
      >
        {messages.length === 0 && (
          <ListItem>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', width: '100%' }}
            >
              Start a conversation with {selectedModel}...
            </Typography>
          </ListItem>
        )}
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const isEmptyMessage = !message.content;
          const shouldShowLoading =
            isLoading && isLastMessage && isEmptyMessage;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isLoading={shouldShowLoading}
            />
          );
        })}
      </List>
    </Paper>
  );
};
