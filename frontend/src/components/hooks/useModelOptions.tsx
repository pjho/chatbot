import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

export default function useLLMModelOptions() {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2:3b');
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        const models = await apiService.getAvailableModels();
        setAvailableModels(models);

        if (models.length > 0 && !models.includes(selectedModel)) {
          setSelectedModel(models[0]);
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, [selectedModel]);

  return {
    loading: isLoadingModels,
    available: availableModels,
    setSelected: setSelectedModel,
    selected: selectedModel,
  };
}
