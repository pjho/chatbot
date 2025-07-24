import React from 'react';
import {
  ListItem,
  Avatar,
  Paper,
  Typography,
} from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';

export const LoadingMessage: React.FC = () => {
  return (
    <ListItem>
      <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
        <BotIcon />
      </Avatar>
      <Paper elevation={1} sx={{ px: 2, py: 1, bgcolor: 'grey.800' }}>
        <Typography variant="body2" color="text.secondary">
          Thinking...
        </Typography>
      </Paper>
    </ListItem>
  );
};
