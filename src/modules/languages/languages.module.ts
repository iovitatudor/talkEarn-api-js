import { forwardRef, Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Language} from './models/languages.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService],
  imports: [
    SequelizeModule.forFeature([Language]),
    forwardRef(() => AuthModule),
    FilesModule,
    forwardRef(() => ProjectsModule),
  ],
  exports: [LanguagesService],
})
export class LanguagesModule {}
