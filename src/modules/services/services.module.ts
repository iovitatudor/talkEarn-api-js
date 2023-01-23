import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/services.model';
import { AuthModule } from '../auth/auth.module';
import { ExpertsModule } from '../experts/experts.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports: [
    SequelizeModule.forFeature([Service]),
    AuthModule,
    ExpertsModule,
    FilesModule,
    forwardRef(() => ProjectsModule),
  ],
})
export class ServicesModule {}
