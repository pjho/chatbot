import { Router } from 'express';
import OllamaService, { type OllamaMessage } from '../services/ollama.js';

const router = Router();

export default function createChatRoutes(ollamaService: OllamaService) {

  router.post('/', async (req, res) => {
    try {
      const { message, messages = [], model = 'deepseek-r1:7b' } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const conversationMessages: OllamaMessage[] = [
        ...messages,
        { role: 'user', content: message }
      ];

      const response = await ollamaService.chat(conversationMessages, model);

      res.json({
        message: response,
        timestamp: new Date().toISOString(),
        model
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  router.get('/models', async (req, res) => {
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

