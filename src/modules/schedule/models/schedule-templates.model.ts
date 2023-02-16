import {
  DataType,
  Model,
  Column,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';

interface ScheduleTemplateCreationAttrs {
  expert_id: number;
  day: number;
  consultation_duration: number;
  consultation_break: number;
  time_start: string;
  time_end: string;
  auto_generate: boolean;
  regenerate_date: Date;
  expired_at: Date;
}

@Table({
  tableName: 'schedule_templates',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ScheduleTemplate extends Model<
  ScheduleTemplate,
  ScheduleTemplateCreationAttrs
> {
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
  public day: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public consultation_duration: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public consultation_break: number;

  @Column({ type: DataType.TIME, allowNull: false })
  public time_start: string;

  @Column({ type: DataType.TIME, allowNull: false })
  public time_end: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  public auto_generate: boolean;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  public regenerate_date: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  public expired_at: Date;

  @BelongsTo(() => Expert, 'expert_id')
  public expert: Expert;
}
