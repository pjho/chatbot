import React from 'react';
import { ListItem, Avatar, Paper, Typography, Box } from '@mui/material';
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';
import { Markdown } from './Markdown';
import { ThinkingBlock } from './ThinkingBlock';
import { parseContentWithThinking } from '../utils/parseThinking';
import type { Message } from '../types/chat';
import { LoadingDots } from './LoadingDots';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

interface ModelResponseProps {
  message: Message;
  isLoading: boolean;
}

const ModelResponse = ({ message, isLoading }: ModelResponseProps) => {
  const content = message.content || 'blerp...';
  const parsedParts = parseContentWithThinking(content);

  return parsedParts.map((part, index) => (
    <Box key={index}>
      {part.type === 'thinking' && part.content ? (
        <ThinkingBlock content={part.content} isStreaming={isLoading} />
      ) : part.type === 'regular' ? (
        <Markdown>{part.content}</Markdown>
      ) : null}
    </Box>
  ));
};

interface UserMessageProps {
  message: Message;
}

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <>
      <Avatar sx={{ bgcolor: 'primary.main', mx: 1 }}>
        <PersonIcon />
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
      </Paper>
    </>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLoading = false,
}) => {
  return (
    <ListItem sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
      {message.role === 'user' ? (
        <UserMessage message={message} />
      ) : (
        <Box>
          {!isLoading && message.content ? (
            <ModelResponse message={message} isLoading={isLoading} />
          ) : (
            <LoadingDots />
          )}
        </Box>
      )}
    </ListItem>
  );
};
