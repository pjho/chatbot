import React from 'react';
import {
  Paper,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import type { Message } from '../types/chat';
import { MessageBubble } from './MessageBubble';
import { LoadingMessage } from './LoadingMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
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
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
              Start a conversation with DeepSeek R1...
            </Typography>
          </ListItem>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <LoadingMessage />}
      </List>
    </Paper>
  );
};
