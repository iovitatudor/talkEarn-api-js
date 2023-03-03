import { forwardRef, Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expert } from '../experts/models/experts.model';
import { AuthModule } from '../auth/auth.module';
import { Schedule } from './models/schedules.model';
import { Appointment } from './models/appointments.model';
import { ScheduleTemplate } from './models/schedule-templates.model';
import { AppointmentReservation } from './models/appointment-reservations.model';
import { ProjectsModule } from '../projects/projects.module';
import { CallsModule } from '../calls/calls.module';
import { Room } from '../calls/models/rooms.model';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    SequelizeModule.forFeature([
      ScheduleTemplate,
      Schedule,
      Appointment,
      AppointmentReservation,
      Expert,
      Room,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => CallsModule),
  ],
})
export class ScheduleModule {}
