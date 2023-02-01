import { Injectable } from '@nestjs/common';
import { FcmService } from 'nestjs-fcm';

@Injectable()
export class CallsService {
  constructor(private readonly fcmService: FcmService) {}

  async sendToDevices(devices, notification) {
    const status = await this.fcmService.sendNotification(
      devices,
      { notification },
      false,
    );
    console.log(status);
  }
}
