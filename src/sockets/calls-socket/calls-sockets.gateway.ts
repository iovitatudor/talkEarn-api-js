import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { CORS, Transports } from '../../config/sockets';
import * as uuid from 'uuid';

@WebSocketGateway({ cors: CORS, transports: Transports })
export class CallsSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  @SubscribeMessage('messageToServer')
  handleMessage(@MessageBody() message: string) {
    console.log(message);
    this.server.emit('messageToClient', message);
  }

  @SubscribeMessage('initCall')
  initCall(@MessageBody() data: string) {
    const dataObject = JSON.parse(data);

    this.server.emit(`outComingCall-${dataObject.senderId}`, data);
    this.server.emit(`inComingCall-${dataObject.recipientId}`, data);
  }

  @SubscribeMessage('declineCall')
  declineCall(@MessageBody() data: string) {
    const dataObject = JSON.parse(data);

    this.server.emit(`declineCall-${dataObject.senderId}`, data);
    this.server.emit(`declineCall-${dataObject.recipientId}`, data);
  }

  @SubscribeMessage('startCall')
  startCall(@MessageBody() data: string) {
    const dataObject = JSON.parse(data);
    const uniqueId = uuid.v4();
    const room =
      uniqueId + '-' + dataObject.senderId + '-' + dataObject.recipientId;

    this.server.emit(
      `startCall-${dataObject.senderId}`,
      JSON.stringify({ ...dataObject, room }),
    );
    this.server.emit(
      `startCall-${dataObject.recipientId}`,
      JSON.stringify({ ...dataObject, room }),
    );
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('Connection');
  }

  handleDisconnect(client: any): any {
    console.log('Disconnection');
  }

  // afterInit(server: any): any {
  //   this.logger.log('Initialize socket gateway.');
  // }
}
