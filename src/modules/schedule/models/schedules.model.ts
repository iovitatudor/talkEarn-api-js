import {
  DataType,
  Model,
  Column,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { ScheduleTemplate } from './schedule-templates.model';

interface ScheduleCreationAttrs {
  expert_id: number;
  schedule_template_id: number;
  date: string;
}

@Table({
  tableName: 'schedules',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Schedule extends Model<Schedule, ScheduleCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public schedule_template_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public date: string;

  @BelongsTo(() => Expert, 'expert_id')
  public expert: Expert;

  @BelongsTo(() => ScheduleTemplate, 'schedule_template_id')
  public scheduleTemplate: ScheduleTemplate;
}
