import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Box,
  Chip,
} from '@mui/material';

interface ModelSelectorProps {
  availableModels: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  isLoading?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  availableModels,
  selectedModel,
  onModelChange,
  isLoading = false,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onModelChange(event.target.value);
  };

  const formatModelName = (model: string) => {
    return model.replace(':latest', '').replace(':', ' ');
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Model</InputLabel>
        <Select
          value={selectedModel}
          label="Model"
          onChange={handleChange}
          disabled={isLoading}
        >
          {availableModels.map((model) => (
            <MenuItem key={model} value={model}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {formatModelName(model)}
                {model.includes('deepseek') && (
                  <Chip label="Current" size="small" color="primary" variant="outlined" />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};