import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Parameter } from './models/parameters.model';
import { ParameterExpert } from './models/parameter-expert.model';
import { ParameterExpertTranslation } from './models/parameter-expert-translations.model';
import { AuthModule } from '../auth/auth.module';
import { ExpertsModule } from '../experts/experts.module';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  providers: [ParametersService],
  controllers: [ParametersController],
  imports: [
    SequelizeModule.forFeature([
      Parameter,
      ParameterExpert,
      ParameterExpertTranslation,
    ]),
    AuthModule,
    ExpertsModule,
    LanguagesModule,
  ],
})
export class ParametersModule {}
