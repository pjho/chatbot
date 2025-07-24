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

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return response.data.models.map((model: any) => model.name);
    } catch (error) {
      console.error('Failed to fetch available models:', error);
      throw new Error('Failed to fetch available models');
    }
  }

  // Update the chat method signature to make model parameter explicit
  async chat(messages: OllamaMessage[], model: string): Promise<string> {
    try {
      const response = await axios.post<OllamaChatResponse>(`${this.baseUrl}/api/chat`, {
        model,
        messages,
        stream: false
      });

      return response.data.message.content;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error(`Failed to get response from model ${model}`);
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
