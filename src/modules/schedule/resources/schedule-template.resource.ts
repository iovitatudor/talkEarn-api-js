import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleTemplateResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 0 })
  public day: number;

  @ApiProperty({ example: 50 })
  public consultationDuration: number;

  @ApiProperty({ example: 20 })
  public consultationBreak: number;

  @ApiProperty({ example: '10:00' })
  public timeStart: string;

  @ApiProperty({ example: '20:00' })
  public time_end: string;

  @ApiProperty({ example: true })
  public autoGenerate: boolean;

  @ApiProperty({ example: '2023-02-14' })
  public regenerateDate: Date;

  @ApiProperty({ example: '2023-02-24' })
  public expiredAt: Date;

  public constructor(scheduleTemplate) {
    if (scheduleTemplate) {
      this.id = scheduleTemplate.id;
      this.day = scheduleTemplate.day;
      this.consultationDuration = scheduleTemplate.consultation_duration;
      this.consultationBreak = scheduleTemplate.consultation_break;
      this.timeStart = scheduleTemplate.time_start;
      this.time_end = scheduleTemplate.time_end;
      this.autoGenerate = scheduleTemplate.auto_generate;
      this.regenerateDate = scheduleTemplate.regenerate_date;
      this.expiredAt = scheduleTemplate.expired_at;
    }
  }

  public static collect(model: Model[]): ScheduleTemplateResource[] {
    return model.map((item) => {
      return new ScheduleTemplateResource(item);
    });
  }
}
