import axios from 'axios';

export interface OllamaMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
}

export interface OllamaChatResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export default class OllamaService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error('Ollama base URL is required');
    }
    this.baseUrl = baseUrl;
  }

  async chat(messages: OllamaMessage[], model = 'deepseek-r1:7b'): Promise<string> {
    try {
      const response = await axios.post<OllamaChatResponse>(`${this.baseUrl}/api/chat`, {
        model,
        messages,
        stream: false
      });

      return response.data.message.content;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('Failed to get response from Ollama');
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/api/tags`);
      return true;
    } catch {
      return false;
    }
  }
}
