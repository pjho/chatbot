import { Conversation, Message, Role } from '../generated/prisma';
import { prisma } from '../db/prisma';

export class ChatService {
  async createConversation(title: string = 'New Chat'): Promise<Conversation> {
    return prisma.conversation.create({
      data: { title },
    });
  }

  async getConversation(publicId: string): Promise<Conversation | null> {
    return prisma.conversation.findUnique({
      where: { publicId },
    });
  }

  async getAllConversations(): Promise<Conversation[]> {
    return prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateConversationTitle(
    publicId: string,
    title: string
  ): Promise<void> {
    await prisma.conversation.update({
      where: { publicId },
      data: { title },
    });
  }

  async addMessage(
    conversationPublicId: string,
    role: Role,
    content: string,
    model?: string
  ): Promise<Message> {
    const conversation = await prisma.conversation.findUnique({
      where: { publicId: conversationPublicId },
      select: { id: true },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return prisma.message.create({
      data: {
        conversationId: conversation.id,
        role,
        content,
        model,
      },
    });
  }

  async getConversationMessages(
    conversationPublicId: string
  ): Promise<Message[]> {
    const conversation = await prisma.conversation.findUnique({
      where: { publicId: conversationPublicId },
      select: { id: true },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });
  }
}
