import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChatInterface } from '../components/ChatInterface';
import { useState } from 'react';
import { apiService } from '../services/api';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleSendMessage = async (message: string, model: string) => {
    setIsCreating(true);
    try {
      const conversationId = await apiService.createConversation(
        message,
        model
      );

      navigate({
        to: '/c/$publicId',
        params: { publicId: conversationId },
        search: { initialMessage: message, model },
      });
    } catch (error) {
      setIsCreating(false);
    }
  };

  return (
    <ChatInterface isCreating={isCreating} onSendMessage={handleSendMessage} />
  );
}
