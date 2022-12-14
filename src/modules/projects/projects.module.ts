import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './models/projects.model';
import { Expert } from '../experts/models/experts.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    SequelizeModule.forFeature([Project, Expert]),
    forwardRef(() => AuthModule),
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
