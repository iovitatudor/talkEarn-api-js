import { forwardRef, Module } from '@nestjs/common';
import { ExpertsController } from './experts.controller';
import { ExpertsService } from './experts.service';
import { Expert } from './models/experts.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '../categories/models/categories.model';
import { Project } from '../projects/models/projects.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ExpertsController],
  providers: [ExpertsService],
  imports: [
    SequelizeModule.forFeature([Expert, Project, Category]),
    forwardRef(() => AuthModule),
  ],
  exports: [ExpertsService],
})
export class ExpertsModule {}
