import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './models/rooms.model';
import { AppointmentReservation } from '../schedule/models/appointment-reservations.model';
import { Appointment } from '../schedule/models/appointments.model';
import { Schedule } from '../schedule/models/schedules.model';
import * as uuid from 'uuid';
import moment from "moment";

@Injectable()
export class CallsService {
  constructor(@InjectModel(Room) private roomRepository: typeof Room) {}

  public async checkToken(token: string) {
    const foundToken = await this.roomRepository.findOne({
      rejectOnEmpty: undefined,
      where: { token },
      include: [
        {
          model: AppointmentReservation,
          include: [
            {
              model: Appointment,
              include: [
                {
                  model: Schedule,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!foundToken) {
      throw new HttpException('Token is not valid.', HttpStatus.BAD_REQUEST);
    }

    return foundToken;
  }

  public async creatRoom(
    appointmentReservationId: number,
    date: Date,
    start_time: string,
    end_time: string,
  ) {
    const token = uuid.v4();
    return await this.roomRepository.create({
      appointment_reservation_id: appointmentReservationId,
      date,
      start_time,
      end_time,
      token,
    });
  }
}
