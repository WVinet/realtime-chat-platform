import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

//crea un servidor websocket dentro de nest
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection() {
    console.log('Cliente conectado');
  }

  handleDisconnect() {
    console.log('Cliente desconectado');
  }
  @WebSocketServer()
  server!: Server;

  ///Escucha eventos llamados "send_message"
  //es equivalente a @POST() y @GET()
  @SubscribeMessage('send_message')
  //MessageBody === @Body()
  handleMessage(@MessageBody() message: string) {
    //reenvia el mensaje a todos los clientes conectados
    this.server.emit('new_message', message);

    return {
      event: 'new_message',
      data: message,
    };
  }
}
