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
  

  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [],
    model?: string,
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        messages: conversationHistory,
        ...(model && { model })
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.message;
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