import { Router } from 'express';
import OllamaService, { type OllamaMessage } from '../services/ollama.js';

const router = Router();

export default function createChatRoutes(ollamaService: OllamaService) {

  router.post('/', async (req, res) => {
    try {
      const { message, messages = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const conversationMessages: OllamaMessage[] = [
        ...messages,
        { role: 'user', content: message }
      ];

      const response = await ollamaService.chat(conversationMessages);

      res.json({
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });
  return router;
}