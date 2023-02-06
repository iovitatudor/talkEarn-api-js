import { forwardRef, Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Language } from './models/languages.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';
import { CategoriesModule } from '../categories/categories.module';
import { CollectionsModule } from '../collections/collections.module';
import { ParametersModule } from '../parameters/parameters.module';
import { ServicesModule } from '../services/services.module';
import { ExpertsModule } from '../experts/experts.module';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService],
  imports: [
    FilesModule,
    SequelizeModule.forFeature([Language]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CollectionsModule),
    forwardRef(() => ParametersModule),
    forwardRef(() => ServicesModule),
    forwardRef(() => ExpertsModule),
  ],
  exports: [LanguagesService],
})
export class LanguagesModule {}
