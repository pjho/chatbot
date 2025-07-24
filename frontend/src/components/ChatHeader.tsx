import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';

interface ChatHeaderProps {
  modelName?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  modelName = 'DeepSeek R1' 
}) => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <BotIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div">
          Local AI Chat - {modelName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
