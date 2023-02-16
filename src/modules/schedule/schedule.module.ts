import { forwardRef, Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expert } from '../experts/models/experts.model';
import { AuthModule } from '../auth/auth.module';
import { Schedule } from './models/schedules.model';
import { Appointment } from './models/appointments.model';
import { ScheduleTemplate } from './models/schedule-templates.model';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    SequelizeModule.forFeature([
      ScheduleTemplate,
      Schedule,
      Appointment,
      Expert,
    ]),
    forwardRef(() => AuthModule),
  ],
})
export class ScheduleModule {}
