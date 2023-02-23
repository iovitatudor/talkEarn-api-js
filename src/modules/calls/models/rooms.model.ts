import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
  Model,
} from 'sequelize-typescript';
import { AppointmentReservation } from '../../schedule/models/appointment-reservations.model';

interface RoomCreateAttrs {
  appointment_reservation_id: number;
  token: string;
  date: Date;
  start_time: string;
  end_time: string;
}

@Table({
  tableName: 'rooms',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Room extends Model<Room, RoomCreateAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => AppointmentReservation)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public appointment_reservation_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public token: string;

  @Column({ type: DataType.DATE, allowNull: false })
  public date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  public start_time: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public end_time: string;

  @BelongsTo(() => AppointmentReservation, 'appointment_reservation_id')
  public appointmentReservation: AppointmentReservation;
}
