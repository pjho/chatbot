import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { apiService, type Conversation } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface ConversationListProps {
  currentConversationId?: string | null;
  onNavigate?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  currentConversationId,
  onNavigate,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const conversations = await apiService.getConversations();
      setConversations(conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      notify('error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const conversation = await apiService.createConversation();
      navigate({
        to: '/c/$publicId',
        params: { publicId: conversation.publicId },
      });
      await loadConversations();
      onNavigate?.();
    } catch (error) {
      notify('error', 'Failed to create new conversation');
    }
  };

  const handleConversationClick = (publicId: string) => {
    navigate({
      to: '/c/$publicId',
      params: { publicId },
    });
    onNavigate?.();
  };

  const formatTitle = (conversation: Conversation) => {
    return conversation.title || `Chat ${conversation.publicId.slice(0, 8)}`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleNewConversation}
          sx={{ mb: 1 }}
        >
          New Chat
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No conversations yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conversation) => (
              <ListItem key={conversation.publicId} disablePadding>
                <ListItemButton
                  selected={currentConversationId === conversation.publicId}
                  onClick={() => handleConversationClick(conversation.publicId)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    },
                  }}
                >
                  <ChatIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                  <ListItemText
                    primary={formatTitle(conversation)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                    }}
                    secondary={new Date(conversation.updatedAt).toLocaleDateString()}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};