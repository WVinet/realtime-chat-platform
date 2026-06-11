import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateRoom(createRoomDTO: CreateRoomDto) {
    //@upsert() === update o insert... funcion de prisma
    return this.prisma.room.upsert({
      //id unico compuesto generado por prisma donde combina id y type
      where: {
        externalId_type: {
          externalId: createRoomDTO.externalId,
          type: createRoomDTO.type,
        },
      },

      update: {},

      create: {
        externalId: createRoomDTO.externalId,
        title: createRoomDTO.title,
        type: createRoomDTO.type,
        imageUrl: createRoomDTO.imageUrl,
      },
    });
  }
}
