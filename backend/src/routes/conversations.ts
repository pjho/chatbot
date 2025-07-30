import { Router } from 'express';
import OllamaService, { type OllamaMessage } from '../services/ollama.js';
import { ChatService } from '../services/ChatService.js';

const router = Router();

export default function createConversationRoutes(ollamaService: OllamaService) {
  router.get('/', async (req, res) => {
    try {
      const chatService = new ChatService();
      const conversations = await chatService.getAllConversations();
      
      res.json({
        conversations: conversations.map((conv) => ({
          publicId: conv.publicId,
          title: conv.title,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
        })),
      });
    } catch (error) {
      console.error('List conversations error:', error);
      res.status(500).json({ error: 'Failed to list conversations' });
    }
  });

  router.get('/:publicId', async (req, res) => {
    try {
      const { publicId } = req.params;
      const chatService = new ChatService();

      const conversation = await chatService.getConversation(publicId);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const messages = await chatService.getConversationMessages(
        conversation.publicId
      );

      res.json({
        conversation: {
          publicId: conversation.publicId,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        },
        messages: messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          model: msg.model,
          createdAt: msg.createdAt,
        })),
      });
    } catch (error) {
      console.error('Load conversation error:', error);
      res.status(500).json({ error: 'Failed to load conversation' });
    }
  });

  router.post('/:publicId/messages', async (req, res) => {
    try {
      const {
        message,
        messages = [],
        model = 'deepseek-r1:7b',
      } = req.body;
      const { publicId: conversationId } = req.params;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const chatService = new ChatService();
      let currentConversationPublicId: string;

      if (conversationId === 'new') {
        const conversation = await chatService.createConversation();
        currentConversationPublicId = conversation.publicId;
      } else {
        currentConversationPublicId = conversationId;
      }

      await chatService.addMessage(
        currentConversationPublicId,
        'user',
        message
      );

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

  return router;
}