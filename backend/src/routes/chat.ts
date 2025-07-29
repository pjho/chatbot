import { Router } from 'express';
import OllamaService, { type OllamaMessage } from '../services/ollama.js';
import { ChatService } from '../services/ChatService.js';

const router = Router();

export default function createChatRoutes(ollamaService: OllamaService) {
  router.post('/stream', async (req, res) => {
    try {
      const {
        message,
        messages = [],
        model = 'deepseek-r1:7b',
        conversationId,
      } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const chatService = new ChatService();
      let currentConversationPublicId: string;

      if (!conversationId) {
        const conversation = await chatService.createConversation();
        currentConversationPublicId = conversation.publicId;
      } else {
        currentConversationPublicId = conversationId;
      }

      await chatService.addMessage(currentConversationPublicId, 'user', message);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      const conversationMessages: OllamaMessage[] = [
        ...messages,
        { role: 'user', content: message },
      ];

      let assistantResponse = '';

      try {
        for await (const token of ollamaService.chatStream(
          conversationMessages,
          model
        )) {
          assistantResponse += token;
          res.write(
            `data: ${JSON.stringify({ token, timestamp: new Date().toISOString(), model, conversationId: currentConversationPublicId })}\n\n`
          );
        }

        await chatService.addMessage(
          currentConversationPublicId,
          'assistant',
          assistantResponse,
          model
        );
        await chatService.disconnect();

        res.write(
          `data: ${JSON.stringify({ done: true, conversationId: currentConversationPublicId })}\n\n`
        );
        res.end();
      } catch (streamError) {
        res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error('Stream chat error:', error);
      res
        .status(500)
        .json({ error: 'Failed to process streaming chat message' });
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
