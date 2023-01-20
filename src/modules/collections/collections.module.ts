import { forwardRef, Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { Expert } from '../experts/models/experts.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService],
  imports: [
    SequelizeModule.forFeature([Collection, Expert]),
    AuthModule,
    FilesModule,
    forwardRef(() => ProjectsModule),
  ],
})
export class CollectionsModule {}
