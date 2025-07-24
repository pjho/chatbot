import React from 'react';
import {ListItem, Avatar, Paper, Typography } from '@mui/material';
import {Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';
import type { Message } from '../types/chat';


interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
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
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {message.timestamp.toLocaleTimeString()}
        </Typography>
      </Paper>
    </ListItem>
  );
};
