import {forwardRef, Module} from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/orders.model';
import {AuthModule} from "../auth/auth.module";
import {ProjectsModule} from "../projects/projects.module";
import { LanguagesModule } from '../languages/languages.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    SequelizeModule.forFeature([Order]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => LanguagesModule),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
