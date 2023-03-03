import {
  DataType,
  Model,
  Column,
  Table,
  BelongsTo, HasOne,
} from 'sequelize-typescript';
import { Appointment } from './appointments.model';
import {Room} from "../../calls/models/rooms.model";

interface AppointmentReservationCreationAttrs {
  appointment_id: number;
  name: string;
  email: string;
  phone: string;
  language: string;
}

@Table({
  tableName: 'appointment-reservations',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AppointmentReservation extends Model<
  AppointmentReservation,
  AppointmentReservationCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public appointment_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public language: string;

  @BelongsTo(() => Appointment, 'appointment_id')
  public appointment: Appointment;

  @HasOne(() => Room, 'appointment_reservation_id')
  public room: Room;
}
