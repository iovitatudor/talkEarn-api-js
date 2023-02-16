import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: '2023.01.20' })
  public date: string;

  public constructor(schedule) {
    if (schedule) {
      this.id = schedule.id;
      this.date = schedule.date;
    }
  }

  public static collect(model: Model[]): ScheduleResource[] {
    return model.map((item) => {
      return new ScheduleResource(item);
    });
  }
}
