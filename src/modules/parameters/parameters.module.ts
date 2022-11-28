import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Parameter } from './models/parameters.model';
import { ParameterExpert } from './models/parameter-expert';
import { AuthModule } from '../auth/auth.module';
import { ExpertsModule } from '../experts/experts.module';

@Module({
  providers: [ParametersService],
  controllers: [ParametersController],
  imports: [
    SequelizeModule.forFeature([Parameter, ParameterExpert]),
    AuthModule,
    ExpertsModule,
  ],
})
export class ParametersModule {}
