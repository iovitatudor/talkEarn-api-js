import { forwardRef, Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { LanguagesModule } from '../languages/languages.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../orders/models/orders.model';
import {OrdersModule} from "../orders/orders.module";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => LanguagesModule),
    forwardRef(() => OrdersModule),
  ],
})
export class PaymentsModule {}
