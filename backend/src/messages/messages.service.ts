import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(
    roomId: number,
    senderId: number,
    content: string,
    imageUrl?: string,
    gameUrl?: string,
  ) {
    return this.prisma.message.create({
      data: {
        roomId,
        senderId,
        content,
        imageUrl,
        gameUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        room: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });
  }

  async getRoomMessages(roomId: number) {
    return this.prisma.message.findMany({
      where: {
        roomId,
      },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
