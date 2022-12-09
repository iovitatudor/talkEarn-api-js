import { Module } from '@nestjs/common';
import { CallsSocketsGateway } from './calls-sockets.gateway';

@Module({
  providers: [CallsSocketsGateway],
})
export class CallsSocketsModule {}
