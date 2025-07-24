import { Router } from 'express';
import OllamaService from '../services/ollama.js';

export default function createHealthRoutes(ollamaService: OllamaService) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json({
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString()
    });
  });

  router.get('/ollama', async (req, res) => {
    const isHealthy = await ollamaService.isHealthy();
    res.json({
      status: isHealthy ? 'ok' : 'error',
      service: 'ollama',
      timestamp: new Date().toISOString()
    });
  });

  return router;
}