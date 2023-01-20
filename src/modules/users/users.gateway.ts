import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { CORS, Transports } from '../../config/sockets';

@WebSocketGateway({ cors: CORS, transports: Transports })
export class UsersGateway {
  @WebSocketServer() server;

  @SubscribeMessage('refreshUsersOnServer')
  refreshUsers() {
    // setInterval(() => {
    //   console.log('refreshUsersOnClient');
    //   this.server.emit('refreshUsersOnClient');
    // }, 25000);
  }
}
