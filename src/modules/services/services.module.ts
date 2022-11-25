import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/services.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports: [SequelizeModule.forFeature([Service]), AuthModule],
})
export class ServicesModule {}
