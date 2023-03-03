import {
  DataType,
  Model,
  Column,
  Table,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { AppointmentStatusesEnum } from '../enums/appointment-statuses.enum';
import { Schedule } from './schedules.model';
import { AppointmentReservation } from './appointment-reservations.model';

interface AppointmentCreationAttrs {
  schedule_id: number;
  time: string;
  duration: string;
  status: AppointmentStatusesEnum;
}

@Table({
  tableName: 'appointments',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Appointment extends Model<Appointment, AppointmentCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public schedule_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public time: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public duration: string;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatusesEnum)),
    allowNull: false,
    defaultValue: AppointmentStatusesEnum.opened,
  })
  public status: AppointmentStatusesEnum;

  @BelongsTo(() => Schedule, 'schedule_id')
  public schedule: Schedule;

  @HasOne(() => AppointmentReservation, 'appointment_id')
  public appointmentReservation: AppointmentReservation;
}
