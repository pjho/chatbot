import { createFileRoute } from '@tanstack/react-router';
import { ChatInterface } from '../../components/ChatInterface';

export const Route = createFileRoute('/c/$publicId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { publicId } = Route.useParams();
  return <ChatInterface conversationId={publicId} />;
}
