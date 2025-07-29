import type { Message } from '../types/chat';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
  model?: string;
}

export interface ModelsResponse {
  models: string[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async sendMessageStream(
    message: string,
    messages: Message[],
    model: string,
    conversationId: string | null,
    onToken: (token: string) => void,
    onComplete: (conversationId: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          messages: conversationHistory,
          model,
          ...(conversationId && { conversationId }),
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedConversationId: string | null = null;

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
              if (data.conversationId)
                receivedConversationId = data.conversationId;
              if (data.done) onComplete(receivedConversationId!);
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
    const response = await fetch(`${this.baseUrl}/api/chat/models`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ModelsResponse = await response.json();
    return data.models;
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
