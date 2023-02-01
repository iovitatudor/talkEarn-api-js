import { forwardRef, Module } from '@nestjs/common';
import { CallsSocketsGateway } from './calls-sockets.gateway';
import { FcmModule } from 'nestjs-fcm';
import * as path from 'path';
import { CallsService } from './calls.service';
import { ExpertsModule } from '../../modules/experts/experts.module';

@Module({
  providers: [CallsSocketsGateway, CallsService],
  imports: [
    FcmModule.forRoot({
      firebaseSpecsPath: path.join(__dirname, '../firebase.spec.json'),
    }),
    forwardRef(() => ExpertsModule),
  ],
  exports: [CallsService],
})
export class CallsSocketsModule {}
