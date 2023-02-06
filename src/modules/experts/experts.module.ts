import { forwardRef, Module } from '@nestjs/common';
import { ExpertsController } from './experts.controller';
import { ExpertsService } from './experts.service';
import { Expert } from './models/experts.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '../categories/models/categories.model';
import { Project } from '../projects/models/projects.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';
import { ExpertTranslation } from './models/experts-translations.model';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  controllers: [ExpertsController],
  providers: [ExpertsService],
  imports: [
    SequelizeModule.forFeature([Expert, ExpertTranslation, Project, Category]),
    FilesModule,
    LanguagesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
  ],
  exports: [ExpertsService],
})
export class ExpertsModule {}
