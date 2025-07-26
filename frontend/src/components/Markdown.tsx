import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
    <Box
      sx={{
        '& > *': { margin: 0 },
        '& p': { marginBottom: 1 },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => (
            <Typography
              variant="body1"
              component="p"
              sx={{ mb: 1, lineHeight: 1.6 }}
            >
              {children}
            </Typography>
          ),
          h1: ({ children }) => (
            <Typography
              variant="h5"
              component="h1"
              sx={{ mb: 1.5, mt: 2, fontWeight: 600 }}
            >
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 1, mt: 1.5, fontWeight: 600 }}
            >
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ mb: 1, mt: 1.5, fontWeight: 600 }}
            >
              {children}
            </Typography>
          ),
          ul: ({ children }) => (
            <Box component="ul" sx={{ pl: 2, mb: 1, '& li': { mb: 0.5 } }}>
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box component="ol" sx={{ pl: 2, mb: 1, '& li': { mb: 0.5 } }}>
              {children}
            </Box>
          ),
          li: ({ children }) => (
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              {children}
            </Typography>
          ),
          code: ({ children, className }) => (
            <Typography
              component="code"
              sx={{
                bgcolor: '#232634',
                color: '#f2d5cf',
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5,
                fontFamily: 'monospace',
                fontSize: '0.875em',
                whiteSpace: 'pre-wrap',
              }}
              className={className}
            >
              {children}
            </Typography>
          ),
          pre: ({ children }) => (
            <Paper
              sx={{
                bgcolor: '#232634',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                my: 1,
                '& code': {
                  bgcolor: 'transparent',
                  color: 'inherit',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre',
                  display: 'block',
                },
              }}
            >
              {children}
            </Paper>
          ),
          a: ({ children, href }) => (
            <Typography
              component="a"
              href={href}
              sx={{
                color: '#8caaee',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#99d1db',
                },
              }}
            >
              {children}
            </Typography>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Box>
  );
};
