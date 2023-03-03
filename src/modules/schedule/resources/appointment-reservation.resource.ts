import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentResource } from './appointment.resource';
import {RoomResource} from "../../calls/resources/room.resource";

export class AppointmentReservationResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 'John Doe' })
  public name: string;

  @ApiProperty({ example: 'johny@gmail.com' })
  public email: string;

  @ApiProperty({ example: '+3736045423' })
  public phone: string;

  public language: string;

  public appointment: object;

  public room: object;

  public constructor(appointmentReservation) {
    if (appointmentReservation) {
      this.id = appointmentReservation.id;
      this.name = appointmentReservation.name;
      this.email = appointmentReservation.email;
      this.phone = appointmentReservation.phone;
      this.language = appointmentReservation.language;
      this.appointment = new AppointmentResource(
        appointmentReservation.appointment,
      );
      this.room = new RoomResource(appointmentReservation.room);
    }
  }

  public static collect(model: Model[]) {
    if (model) {
      return model.map((item) => {
        return new AppointmentReservationResource(item);
      });
    }
  }
}
