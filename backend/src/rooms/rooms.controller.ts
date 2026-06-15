import { Body, Controller, Post, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.findOrCreateRoom(createRoomDto);
  }

  @Get()
  findAllRooms() {
    return this.roomsService.findAllRooms();
  }
}
