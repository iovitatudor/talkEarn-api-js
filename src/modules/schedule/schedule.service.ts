import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ScheduleCreateDto } from './dto/schedule-create.dto';
import { Schedule } from './models/schedules.model';
import { Appointment } from './models/appointments.model';
import moment = require('moment');
import { ScheduleTemplate } from './models/schedule-templates.model';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) private scheduleRepository: typeof Schedule,
    @InjectModel(ScheduleTemplate)
    private scheduleTemplateRepository: typeof ScheduleTemplate,
    @InjectModel(Appointment) private appointmentRepository: typeof Appointment,
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

  public async fetchAppointments(expertId: number, date: string) {
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
    const appointments = await this.appointmentRepository.findAll({
      where: { schedule_id: schedule.id },
      include: [
        {
          model: Schedule,
        },
      ],
    });
    return { schedule, appointments };
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
      await findScheduleTemplates.destroy();
    }

    return await this.scheduleTemplateRepository.create({
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
    const startTime = moment(from, 'HH.mm');
    const endTime = moment(to, 'HH.mm');
    const totalDuration =
      parseInt(String(consultationDuration)) +
      parseInt(String(breakConsultation));
    const result = [];
    let consultationTime = startTime;

    while (consultationTime.isBefore(endTime)) {
      result.push(consultationTime.format('HH.mm'));
      consultationTime = startTime.add(totalDuration, 'minutes');
    }
    return result;
  }
}