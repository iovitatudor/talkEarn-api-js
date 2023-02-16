import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatusesEnum } from '../enums/appointment-statuses.enum';
import { ScheduleResource } from './schedule.resource';

export class AppointmentResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: '12:00' })
  public time: string;

  @ApiProperty({ example: '50' })
  public duration: string;

  @ApiProperty({ example: 'opened' })
  public status: AppointmentStatusesEnum;

  public schedule: object;

  public constructor(appointment) {
    if (appointment) {
      this.id = appointment.id;
      this.time = appointment.time;
      this.duration = appointment.duration;
      this.status = appointment.status;
      this.schedule = new ScheduleResource(appointment.schedule);
    }
  }

  public static collect(model: Model[], schedule: ScheduleResource) {
    if (model) {
      const data = {};
      data['data'] = model.map((item) => {
        return new AppointmentResource(item);
      });
      if (schedule) {
        data['schedule'] = schedule;
      }
      return data;
    }
    // return model.map((item) => {
    //   return new AppointmentResource(item);
    // });
  }
}
