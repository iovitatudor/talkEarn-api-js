import { forwardRef, Module } from '@nestjs/common';
import { SupervisorsService } from './services/supervisors.service';
import { SupervisorsController } from './controllers/supervisors.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupervisorNotifications } from './models/supervisor-notifications.model';
import { AuthModule } from '../auth/auth.module';
import { LanguagesModule } from '../languages/languages.module';
import { Expert } from '../experts/models/experts.model';

@Module({
  providers: [SupervisorsService],
  controllers: [SupervisorsController],
  imports: [
    SequelizeModule.forFeature([SupervisorNotifications, Expert]),
    forwardRef(() => AuthModule),
    forwardRef(() => LanguagesModule),
  ],
})
export class NotificationsModule {}
