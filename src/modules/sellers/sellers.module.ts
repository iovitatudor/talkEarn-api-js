import { forwardRef, Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Seller } from './models/sellers.model';
import { AuthModule } from '../auth/auth.module';
import { ExpertsModule } from '../experts/experts.module';
import { FilesModule } from '../../common/files/files.module';
import { ProjectsModule } from '../projects/projects.module';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  providers: [SellersService],
  controllers: [SellersController],
  imports: [
    SequelizeModule.forFeature([Seller]),
    FilesModule,
    forwardRef(() => ExpertsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => LanguagesModule),
    forwardRef(() => ProjectsModule),
  ],
  exports: [SellersService],
})
export class SellersModule {}
