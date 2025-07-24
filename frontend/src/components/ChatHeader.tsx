import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';
import { ModelSelector } from './ModelSelector';

interface ChatHeaderProps {
  modelName?: string;
  availableModels: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  isLoadingModels?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  modelName = 'Local AI Chat',
  availableModels,
  selectedModel,
  onModelChange,
  isLoadingModels = false,
}) => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <BotIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {modelName}
        </Typography>
        <ModelSelector
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          isLoading={isLoadingModels}
        />
      </Toolbar>
    </AppBar>
  );
};