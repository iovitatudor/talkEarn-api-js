import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './models/rooms.model';

@Module({
  controllers: [CallsController],
  providers: [CallsService],
  imports: [SequelizeModule.forFeature([Room])],
  exports: [CallsService],
})
export class CallsModule {}
