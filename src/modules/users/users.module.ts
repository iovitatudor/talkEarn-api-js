import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '../categories/models/categories.model';
import { Project } from '../projects/models/projects.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersAuhService } from './users-auh.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersAuhService],
  imports: [
    SequelizeModule.forFeature([User, Project, Category]),
    forwardRef(() => AuthModule),
    FilesModule,
    forwardRef(() => ProjectsModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
