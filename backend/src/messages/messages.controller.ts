import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('room/:roomId')
  getRoomMessages(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.messagesService.getRoomMessages(roomId);
  }
}
