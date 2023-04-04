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
import { CallsService } from './calls.service';
import { ExpertsService } from '../../modules/experts/experts.service';

@WebSocketGateway({ cors: CORS, transports: Transports })
export class CallsSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  constructor(
    private callsService: CallsService,
    private expertService: ExpertsService,
  ) {}

  @SubscribeMessage('messageToServer')
  handleMessage(@MessageBody() message: string) {
    this.server.emit('messageToClient', message);
  }

  @SubscribeMessage('initCall')
  async initCall(@MessageBody() data: string) {
    const dataObject = JSON.parse(data);

    try {
      const expertId = dataObject.recipientId.split('-')[1];
      const expert = await this.expertService.findById(expertId);

      if (expert) {
        const devices = [expert.device_token];
        const notification = {
          title: 'InstantExpert',
          body: 'Incoming call...',
        };
        await this.callsService.sendToDevices(devices, notification);
      }
    } catch (e) {
      console.error(e);
    }

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
  async startCall(@MessageBody() data: string) {
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

  @SubscribeMessage('remoteLogin')
  async remoteLogin(@MessageBody() data: string) {
    const dataObject = JSON.parse(data);
    this.server.emit(
      `login-${dataObject.client.cookie}`,
      JSON.stringify(dataObject.client),
    );
  }

  @SubscribeMessage('paymentNotification')
  async sendPaymentNotification(@MessageBody() data: string) {
    const dataObject = JSON.parse(data);
    this.server.emit(
      `payment-${dataObject.client.cookie}`,
      JSON.stringify(dataObject.order),
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
