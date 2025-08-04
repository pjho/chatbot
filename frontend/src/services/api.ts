import type { Message } from '../types/chat';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface ModelsResponse {
  models: string[];
}

export interface Conversation {
  publicId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
}

interface SendMessageStreamParams {
  message: string;
  messages: Message[];
  model: string;
  conversationId: string;
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async createConversation(): Promise<Conversation> {
    const response = await fetch(`${this.baseUrl}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    return await response.json();
  }

  async sendMessageStream({
    message,
    messages,
    model,
    conversationId,
    onToken,
    onComplete,
    onError,
  }: SendMessageStreamParams): Promise<void> {
    try {
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(
        `${this.baseUrl}/api/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            messages: conversationHistory,
            model,
          }),
        }
      );

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line.length > 6) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) onToken(data.token);
              if (data.done) onComplete();
              if (data.error) onError(data.error);
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }
      }
    } catch (error) {
      onError('Streaming failed');
    }
  }

  async getAvailableModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/models`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ModelsResponse = await response.json();
    return data.models;
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${this.baseUrl}/api/conversations`);
    
    if (!response.ok) {
      throw new Error(`Failed to load conversations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.conversations || [];
  }

  async getConversation(publicId: string): Promise<ConversationWithMessages> {
    const response = await fetch(`${this.baseUrl}/api/conversations/${publicId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Conversation not found');
      }
      throw new Error(`Failed to load conversation: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      conversation: data.conversation,
      messages: data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
      })),
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
