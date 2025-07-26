import React from 'react';
import { ListItem, Avatar, Paper, Typography, Box } from '@mui/material';
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';
import { Markdown } from './Markdown';
import type { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLoading = false,
}) => {
  return (
    <ListItem
      sx={{
        display: 'flex',
        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 1,
      }}
    >
      <Avatar
        sx={{
          bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
          mx: 1,
        }}
      >
        {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
      </Avatar>
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1,
          maxWidth: '70%',
          bgcolor: message.role === 'user' ? 'primary.dark' : 'grey.800',
        }}
      >
        {message.role === 'user' ? (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content || (isLoading ? 'Typing...' : '')}
          </Typography>
        ) : (
          <Box sx={{ '& > *': { margin: 0 }, '& p': { marginBottom: 1 } }}>
            {message.content || isLoading ? (
              <Markdown>{message.content || 'Thinking...'}</Markdown>
            ) : (
              <Typography variant="body1">Thinking...</Typography>
            )}
          </Box>
        )}
        <Typography variant="caption" color="text.secondary">
          {message.timestamp.toLocaleTimeString()}
        </Typography>
      </Paper>
    </ListItem>
  );
};
