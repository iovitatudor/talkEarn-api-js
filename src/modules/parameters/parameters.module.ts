import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Parameter } from './models/parameters.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ParametersService],
  controllers: [ParametersController],
  imports: [SequelizeModule.forFeature([Parameter]), AuthModule],
})
export class ParametersModule {}
