import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { GamesService } from 'src/games/games.service';

const activeRooms = new Map<string, Map<string, string>>();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly gamesService: GamesService,
  ) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);

    activeRooms.forEach((users, roomName) => {
      if (users.has(client.id)) {
        users.delete(client.id);

        this.server.to(roomName).emit('active_users', {
          count: users.size,
          users: Array.from(users.values()),
        });
      }
    });
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody()
    payload: {
      roomId: number;
      username: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `room-${payload.roomId}`;

    client.join(roomName);

    if (!activeRooms.has(roomName)) {
      activeRooms.set(roomName, new Map());
    }

    activeRooms.get(roomName)!.set(client.id, payload.username);

    this.server.to(roomName).emit('active_users', {
      count: activeRooms.get(roomName)!.size,
      users: Array.from(activeRooms.get(roomName)!.values()),
    });

    console.log(`Cliente ${client.id} entró a ${roomName}`);

    return {
      event: 'joined_room',
      data: {
        roomId: payload.roomId,
        roomName,
      },
    };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    payload: {
      roomId: number;
      message: string;
      senderId: number;
    },
  ) {
    const roomName = `room-${payload.roomId}`;

    const savedUserMessage = await this.messagesService.createMessage(
      payload.roomId,
      payload.senderId,
      payload.message,
    );

    this.server.to(roomName).emit('new_message', savedUserMessage);

    if (payload.message.toLowerCase().startsWith('!bot buscar ')) {
      const search = payload.message.replace('!bot buscar ', '').trim();

      const game = await this.gamesService.searchFirstGame(search);

      if (!game) {
        const botMessage = await this.messagesService.createMessage(
          payload.roomId,
          3,
          '❌ No encontré ningún juego.',
        );

        this.server.to(roomName).emit('new_message', botMessage);

        return;
      }

      const content =
        `🎮 ${game.name}\n` +
        `⭐ Rating: ${game.rating}\n` +
        `📅 Lanzamiento: ${game.released}\n` +
        `🖥️ Plataformas: ${game.platforms}\n` +
        `🏷️ Géneros: ${game.genres}`;

      const botMessage = await this.messagesService.createMessage(
        payload.roomId,
        3,
        content,
        game.imageUrl,
        game.rawgUrl,
      );

      this.server.to(roomName).emit('new_message', botMessage);
    }
  }
}
