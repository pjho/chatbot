import React, { useState } from 'react';
import { Box, Paper, Collapse, IconButton, Typography } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Markdown } from './Markdown';

interface ThinkingBlockProps {
  content: string;
  isStreaming: boolean;
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({
  content,
  isStreaming,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  React.useEffect(() => {
    if (!isStreaming && isExpanded) {
      const timer = setTimeout(() => setIsExpanded(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper
      sx={{
        bgcolor: isStreaming ? '#2a273f' : '#232634',
        my: 1,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          cursor: isStreaming ? 'default' : 'pointer',
        }}
        onClick={isStreaming ? undefined : handleToggle}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.8rem',
            color: '#5c5f77',
            mb: 0,
          }}
        >
          {isStreaming ? 'Thinking...' : 'Thought process'}
        </Typography>

        {!isStreaming && (
          <IconButton size="small" sx={{ color: '#737994' }}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      <Collapse in={isExpanded} timeout={300}>
        <Box
          sx={{
            p: 2,
            pt: 0,
            maxHeight: isStreaming ? 'none' : '300px',
            overflow: 'auto',
            fontSize: '0.875rem',
            opacity: isStreaming ? 1 : 0.8,
          }}
        >
          <Markdown>{content}</Markdown>
        </Box>
      </Collapse>
    </Paper>
  );
};
