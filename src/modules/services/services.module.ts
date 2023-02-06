import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/services.model';
import { AuthModule } from '../auth/auth.module';
import { ExpertsModule } from '../experts/experts.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';
import { ServiceTranslation } from './models/services-translations.model';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports: [
    SequelizeModule.forFeature([Service, ServiceTranslation]),
    FilesModule,
    forwardRef(() => ExpertsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => LanguagesModule),
    forwardRef(() => ProjectsModule),
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
