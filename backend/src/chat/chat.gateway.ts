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

//crea un servidor websocket dentro de nest
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);

    console.log(client.handshake.auth);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);
  }
  @WebSocketServer()
  server!: Server;

  ///Escucha eventos llamados "send_message"
  //es equivalente a @POST() y @GET()
  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody()
    payload: {
      roomId: number;
      message: string;
    },
  ) {
    const roomName = `room-${payload.roomId}`;

    this.server.to(roomName).emit('new_message', {
      roomId: payload.roomId,
      message: payload.message,
    });

    return {
      event: 'new_message',
      data: {
        roomId: payload.roomId,
        message: payload.message,
      },
    };
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `room-${roomId}`;

    client.join(roomName);

    console.log(`Cliente ${client.id} entró a ${roomName}`);

    return {
      event: 'joined_room',
      data: {
        roomId,
        roomName,
      },
    };
  }
}
