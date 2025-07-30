import { Router } from 'express';
import OllamaService from '../services/ollama.js';

const router = Router();

export default function createModelRoutes(ollamaService: OllamaService) {
  router.get('/', async (req, res) => {
    try {
      const models = await ollamaService.getAvailableModels();
      res.json({ models });
    } catch (error) {
      console.error('Models fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch available models' });
    }
  });

  return router;
}