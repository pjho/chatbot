import { PrismaClient, Conversation, Message, Role } from '../generated/prisma';

export class ChatService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Conversation methods
  async createConversation(title: string = 'New Chat'): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: { title },
    });
  }

  async getConversation(publicId: string): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: { publicId },
    });
  }

  async getAllConversations(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateConversationTitle(publicId: string, title: string): Promise<void> {
    await this.prisma.conversation.update({
      where: { publicId },
      data: { title },
    });
  }

  // Message methods
  async addMessage(
    conversationPublicId: string,
    role: Role,
    content: string,
    model?: string
  ): Promise<Message> {
    // First get the conversation to find its internal ID
    const conversation = await this.prisma.conversation.findUnique({
      where: { publicId: conversationPublicId },
      select: { id: true }
    });
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role,
        content,
        model,
      },
    });
  }

  async getConversationMessages(conversationPublicId: string): Promise<Message[]> {
    // First get the conversation to find its internal ID
    const conversation = await this.prisma.conversation.findUnique({
      where: { publicId: conversationPublicId },
      select: { id: true }
    });
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return this.prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
