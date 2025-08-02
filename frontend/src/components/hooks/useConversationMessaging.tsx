import { useState } from 'react';
import type { Message } from '../../types/chat';
import { apiService } from '../../services/api';
import type { NotifyFunction } from '../../contexts/NotificationContext';

export default function useCreateMessage(
  conversationId: string | null,
  model: string,
  notify: NotifyFunction
) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const _addMessage = (role: 'user' | 'assistant', message: string) => {
    const _message: Message = {
      id: crypto.randomUUID(),
      role,
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, _message]);
  };

  const onToken = (token: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content: updated[updated.length - 1].content + token,
      };
      return updated;
    });
  };

  const onError = (error: string) => {
    setIsLoading(false);
    notify('error', `Streaming failed: ${error}`);
  };

  const onComplete = () => {
    setIsLoading(false);
  };

  const create = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);
    try {
      return await apiService.createConversation();
    } catch (e) {
      notify('error', `Failed to create message - ${e}`);
    }
  };

  const addMessage = async (message: string) => {
    if (!message.trim()) return;
    if (!conversationId) return;

    setIsLoading(true);

    _addMessage('user', message);
    _addMessage('assistant', '');

    await apiService.sendMessageStream({
      message,
      messages,
      model,
      conversationId,
      onToken,
      onComplete,
      onError,
    });
  };

  return {
    loading: isLoading,
    messages,
    create,
    addMessage,
  };
}
