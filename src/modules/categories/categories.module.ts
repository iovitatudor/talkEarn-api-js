import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/categories.model';
import { Expert } from '../experts/models/experts.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';
import { CategoryTranslation } from './models/categories_translations.model';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    FilesModule,
    SequelizeModule.forFeature([Category, CategoryTranslation, Expert]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => LanguagesModule),
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
