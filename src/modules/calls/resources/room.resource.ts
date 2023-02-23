import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentReservationResource } from '../../schedule/resources/appointment-reservation.resource';

export class RoomResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: '3123924308043580348503403495340-' })
  public token: string;

  @ApiProperty({ example: '10.2.2023' })
  public expiredAt: string;

  public appointmentReservation: object;

  public constructor(room) {
    if (room) {
      this.id = room.id;
      this.token = room.token;
      this.expiredAt = room.expired_at;
      this.appointmentReservation = new AppointmentReservationResource(
        room.appointmentReservation,
      );
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
