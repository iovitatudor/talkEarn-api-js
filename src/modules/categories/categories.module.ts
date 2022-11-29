import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/categories.model';
import { Expert } from '../experts/models/experts.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Category, Expert]),
    AuthModule,
    FilesModule,
  ],
})
export class CategoriesModule {}
