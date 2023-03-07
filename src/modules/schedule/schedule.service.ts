import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ScheduleCreateDto } from './dto/schedule-create.dto';
import { Schedule } from './models/schedules.model';
import { Appointment } from './models/appointments.model';
import { ScheduleTemplate } from './models/schedule-templates.model';
import { AppointmentReservation } from './models/appointment-reservations.model';
import { AppointmentStatusesEnum } from './enums/appointment-statuses.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { AppointmentReservationCreateDto } from './dto/appointment-reservation-create.dto';
import { Expert } from '../experts/models/experts.model';
import { ExpertTranslation } from '../experts/models/experts-translations.model';
import { CallsService } from '../calls/calls.service';
import moment = require('moment');
import { Room } from '../calls/models/rooms.model';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) private scheduleRepository: typeof Schedule,
    @InjectModel(Appointment) private appointmentRepository: typeof Appointment,
    @InjectModel(ScheduleTemplate)
    private scheduleTemplateRepository: typeof ScheduleTemplate,
    @InjectModel(AppointmentReservation)
    private appointmentReservationRepository: typeof AppointmentReservation,
    @InjectModel(Room) private roomRepository: typeof Room,
    private mailerService: MailerService,
    private callService: CallsService,
  ) {}

  public async fetchSchedule(expertId: number) {
    return await this.scheduleRepository.findAll({
      where: { expert_id: expertId },
    });
  }

  public async fetchScheduleTemplate(day: number, expertId: number) {
    return await this.scheduleTemplateRepository.findOne({
      rejectOnEmpty: undefined,
      where: { expert_id: expertId, day },
    });
  }

  public async fetchScheduleTemplates(expertId: number) {
    return await this.scheduleTemplateRepository.findAll({
      where: { expert_id: expertId },
      order: [['day', 'ASC']],
    });
  }

  public async fetchAppointments(
    expertId: number,
    date: string,
    status: string,
  ) {
    const schedule = await this.scheduleRepository.findOne({
      rejectOnEmpty: undefined,
      where: { expert_id: expertId, date },
    });
    if (!schedule) {
      throw new HttpException(
        'Schedule was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const where = { schedule_id: schedule.id };

    if (status) {
      where['status'] = AppointmentStatusesEnum[status];
    }

    const appointments = await this.appointmentRepository.findAll({
      where: { ...where },
      include: [
        {
          model: Schedule,
        },
        {
          model: AppointmentReservation,
          include: [
            {
              model: Room,
            },
          ],
        },
      ],
    });
    return { schedule, appointments };
  }

  public async fetchMatchedAppointments(
    authExpertId: number,
    expertId: number,
    date: string,
  ) {
    const authExpertSchedule = await this.scheduleRepository.findOne({
      rejectOnEmpty: undefined,
      where: { expert_id: authExpertId, date },
    });
    const schedule = await this.scheduleRepository.findOne({
      rejectOnEmpty: undefined,
      where: { expert_id: expertId, date },
    });
    if (!schedule || !authExpertSchedule) {
      throw new HttpException(
        'Schedule was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const authExpertAppointments = await this.appointmentRepository.findAll({
      raw: true,
      where: {
        schedule_id: authExpertSchedule.id,
        status: AppointmentStatusesEnum.opened,
      },
    });

    const authExpertAppointmentsIds = authExpertAppointments.map(
      (appointment) => {
        return appointment.time;
      },
    );

    const appointments = await this.appointmentRepository.findAll({
      where: {
        time: authExpertAppointmentsIds,
        schedule_id: schedule.id,
        status: AppointmentStatusesEnum.opened,
      },
      include: [
        {
          model: Schedule,
        },
        {
          model: AppointmentReservation,
          include: [
            {
              model: Room,
            },
          ],
        },
      ],
    });
    return { schedule, appointments };
  }

  public async changeAppointmentStatus(appointmentId, status) {
    await this.appointmentReservationRepository.destroy({
      where: { appointment_id: appointmentId },
    });

    await this.appointmentRepository.update(
      { status: AppointmentStatusesEnum[status] },
      {
        returning: undefined,
        where: { id: appointmentId },
      },
    );

    return this.findAppointment(appointmentId);
  }

  public async findAppointment(appointmentId: number) {
    return await this.appointmentRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: appointmentId },
    });
  }

  public async findReservedAppointment(appointmentId: number) {
    return await this.appointmentReservationRepository.findOne({
      rejectOnEmpty: undefined,
      where: { appointment_id: appointmentId },
    });
  }

  public async findReservedAppointmentById(id: number) {
    return await this.appointmentReservationRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
      include: [
        {
          model: Appointment,
          include: [
            {
              model: Schedule,
              include: [
                {
                  model: Expert,
                  include: [
                    {
                      model: ExpertTranslation,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  public async updateReservedAppointment(
    appointmentReservationDto,
    reservedAppointmentId,
  ) {
    await this.appointmentReservationRepository.update(
      {
        appointment_id: appointmentReservationDto.appointmentId,
        ...appointmentReservationDto,
      },
      {
        where: { id: reservedAppointmentId },
      },
    );

    return await this.findAppointment(appointmentReservationDto.appointmentId);
  }

  public async bookAppointment(
    appointmentReservationDto: AppointmentReservationCreateDto,
  ) {
    const appointment = await this.appointmentRepository.update(
      { status: AppointmentStatusesEnum.reserved },
      {
        returning: undefined,
        where: { id: appointmentReservationDto.appointmentId },
      },
    );

    if (!appointment) {
      throw new HttpException(
        'Appointment was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const reservedAppointment = await this.findReservedAppointment(
      appointmentReservationDto.appointmentId,
    );

    if (reservedAppointment) {
      throw new HttpException(
        'The reservation is already created',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdReservation =
      await this.appointmentReservationRepository.create({
        appointment_id: appointmentReservationDto.appointmentId,
        ...appointmentReservationDto,
      });

    const reservation = await this.findReservedAppointmentById(
      createdReservation.id,
    );

    const reservationDate = reservation.appointment.schedule.date;
    const reservationStartTime = moment(reservation.appointment.time, 'HH:mm');
    const reservationEndTime = reservationStartTime
      .add(reservation.appointment.duration, 'minutes')
      .format('HH:mm');

    const room = await this.callService.creatRoom(
      reservation.id,
      new Date(reservationDate),
      reservation.appointment.time,
      reservationEndTime,
    );

    const reservationLink = `https://instantexpert.online/${appointmentReservationDto.language}/conference/${room.token}`;
    const emailData = {
      date: `${reservationDate}, ${reservation.appointment.time}-${reservationEndTime}`,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      expert: reservation.appointment.schedule.expert.translation.name,
      link: reservationLink,
    };

    await this.sendMail(reservation.email, emailData);
    await this.sendMail(
      reservation.appointment.schedule.expert.email,
      emailData,
    );

    return await this.findAppointment(appointmentReservationDto.appointmentId);
  }

  public async storeSchedule(scheduleDto: ScheduleCreateDto) {
    const weekDays = scheduleDto.weekDays;
    const appointments = this.generateGetAppointments(
      scheduleDto.from,
      scheduleDto.to,
      scheduleDto.duration,
      scheduleDto.breakConsultation,
    );

    for (const weekDay of weekDays) {
      const scheduleTemplate = await this.storeScheduleTemplate(
        scheduleDto,
        weekDay,
      );
      const datesPerDay = this.generateScheduleDates(weekDay);

      for (const datePerDay of datesPerDay) {
        const findSchedule = await this.scheduleRepository.findOne({
          rejectOnEmpty: undefined,
          attributes: ['id'],
          where: {
            expert_id: scheduleDto.expertId,
            date: datePerDay,
          },
        });
        if (!findSchedule) {
          const schedule = await this.scheduleRepository.create({
            expert_id: scheduleDto.expertId,
            schedule_template_id: scheduleTemplate.id,
            date: datePerDay,
          });
          for (const appointment of appointments) {
            await this.appointmentRepository.create({
              schedule_id: schedule.id,
              time: appointment,
              duration: scheduleDto.duration.toString(),
            });
          }
        }
      }
    }
    return await this.scheduleRepository.findAll({
      where: { expert_id: scheduleDto.expertId },
    });
  }

  public async destroySchedule(expertId: number) {
    const findSchedules = await this.scheduleRepository.findAll({
      where: { expert_id: expertId },
      attributes: ['id'],
      raw: true,
    });

    const scheduleIds = findSchedules.map((schedule) => {
      return schedule.id;
    });

    const findAppointments = await this.appointmentRepository.findAll({
      where: { schedule_id: scheduleIds },
      attributes: ['id'],
      raw: true,
    });

    const appointmentIds = findAppointments.map((appointment) => {
      return appointment.id;
    });

    const findReservationAppointments =
      await this.appointmentReservationRepository.findAll({
        where: { appointment_id: appointmentIds },
        attributes: ['id'],
        raw: true,
      });

    const reservedAppointmentIds = findReservationAppointments.map(
      (appointmentReservation) => {
        return appointmentReservation.id;
      },
    );

    await this.roomRepository.destroy({
      where: { appointment_reservation_id: reservedAppointmentIds },
    });

    await this.appointmentReservationRepository.destroy({
      where: { appointment_id: appointmentIds },
    });

    await this.appointmentRepository.destroy({
      where: { schedule_id: scheduleIds },
    });

    await this.scheduleRepository.destroy({
      where: { expert_id: expertId },
      force: true,
    });

    return await this.scheduleTemplateRepository.destroy({
      where: { expert_id: expertId },
      force: true,
    });
  }

  private async storeScheduleTemplate(
    scheduleDto: ScheduleCreateDto,
    day: number,
  ) {
    const findScheduleTemplates = await this.scheduleTemplateRepository.findOne(
      {
        rejectOnEmpty: undefined,
        where: { expert_id: scheduleDto.expertId, day },
      },
    );

    const regenerateDate = moment().add(20, 'days');
    const expiredAt = moment().add(30, 'days');

    if (findScheduleTemplates) {
      await this.scheduleTemplateRepository.update(
        {
          day: day,
          consultation_duration: scheduleDto.duration,
          consultation_break: scheduleDto.breakConsultation,
          time_start: scheduleDto.from,
          time_end: scheduleDto.to,
          auto_generate: scheduleDto.autoGenerate,
          regenerate_date: new Date(regenerateDate.format('YYYY-MM-DD')),
          expired_at: new Date(expiredAt.format('YYYY-MM-DD')),
        },
        {
          where: { expert_id: scheduleDto.expertId, day },
        },
      );
    } else {
      await this.scheduleTemplateRepository.create({
        expert_id: scheduleDto.expertId,
        day: day,
        consultation_duration: scheduleDto.duration,
        consultation_break: scheduleDto.breakConsultation,
        time_start: scheduleDto.from,
        time_end: scheduleDto.to,
        auto_generate: scheduleDto.autoGenerate,
        regenerate_date: new Date(regenerateDate.format('YYYY-MM-DD')),
        expired_at: new Date(expiredAt.format('YYYY-MM-DD')),
      });
    }

    return await this.scheduleTemplateRepository.findOne({
      rejectOnEmpty: undefined,
      where: { expert_id: scheduleDto.expertId, day },
    });
  }

  private generateScheduleDates(day: number): Array<any> {
    const start = moment();
    const end = moment().add(31, 'd');

    const arr = [];
    const tmp = start.clone().day(day);
    if (tmp.isAfter(start, 'd')) {
      arr.push(tmp.format('YYYY-MM-DD'));
    }
    while (tmp.isBefore(end)) {
      tmp.add(7, 'days');
      arr.push(tmp.format('YYYY-MM-DD'));
    }
    return arr;
  }

  private generateGetAppointments(
    from: string,
    to: string,
    consultationDuration: number,
    breakConsultation: number,
  ): Array<any> {
    const startTime = moment(from, 'HH:mm');
    const endTime = moment(to, 'HH:mm');
    const totalDuration =
      parseInt(String(consultationDuration)) +
      parseInt(String(breakConsultation));
    const result = [];
    let consultationTime = startTime;

    while (consultationTime.isBefore(endTime)) {
      result.push(consultationTime.format('HH:mm'));
      consultationTime = startTime.add(totalDuration, 'minutes');
    }
    return result;
  }

  private async sendMail(to: string, data: object) {
    await this.mailerService.sendMail({
      to: to,
      from: 'iovitatudor@gmail.com',
      subject: 'Appointment instantexpert.online',
      template: 'conference-client',
      context: { data },
    });
  }
}
