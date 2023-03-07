import {
  Post,
  Body,
  Controller,
  UseGuards,
  HttpCode,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Patch, HttpException, HttpStatus, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ScheduleService } from './schedule.service';
import { ScheduleCreateDto } from './dto/schedule-create.dto';
import { ScheduleResource } from './resources/schedule.resource';
import { AppointmentResource } from './resources/appointment.resource';
import { ScheduleTemplateResource } from './resources/schedule-template.resource';
import { ClientGuard } from '../auth/guards/client.guard';
import { AppointmentReservationCreateDto } from './dto/appointment-reservation-create.dto';
import { AppointmentReservationResource } from './resources/appointment-reservation.resource';

@ApiTags('Schedule')
@Controller('api')
export class ScheduleController {
  public constructor(private scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Create schedule' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Post('schedule')
  public async createSchedule(
    @Body() scheduleDto: ScheduleCreateDto,
  ): Promise<ScheduleResource[]> {
    const schedule = await this.scheduleService.storeSchedule(scheduleDto);
    return ScheduleResource.collect(schedule);
  }

  @ApiOperation({ summary: 'Get schedule per expert' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('schedule/:expertId')
  public async getSchedules(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<ScheduleResource[]> {
    const schedule = await this.scheduleService.fetchSchedule(expertId);
    return ScheduleResource.collect(schedule);
  }

  @ApiOperation({ summary: 'Get schedule template by day' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('schedule/template/:day/:expertId')
  public async getScheduleTemplate(
    @Param('day', ParseIntPipe) day: number,
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<ScheduleTemplateResource> {
    const scheduleTemplate = await this.scheduleService.fetchScheduleTemplate(
      day,
      expertId,
    );
    return new ScheduleTemplateResource(scheduleTemplate);
  }

  @ApiOperation({ summary: 'Get all schedule templates per expert' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('schedule/templates/:expertId')
  public async getScheduleTemplates(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<ScheduleTemplateResource[]> {
    const scheduleTemplates = await this.scheduleService.fetchScheduleTemplates(
      expertId,
    );
    return ScheduleTemplateResource.collect(scheduleTemplates);
  }

  @ApiOperation({ summary: 'Delete schedule' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(204)
  @Delete('schedule/:expertId')
  public async deleteSchedule(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<number> {
    return this.scheduleService.destroySchedule(expertId);
  }

  @ApiOperation({ summary: 'Get appointments by expert id and date' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('appointments/:expertId/:date')
  public async getAppointments(
    @Query() query,
    @Param('expertId', ParseIntPipe) expertId: number,
    @Param('date') date: string,
  ): Promise<{}> {
    const status = query.status;
    const { schedule, appointments } =
      await this.scheduleService.fetchAppointments(expertId, date, status);

    return AppointmentResource.collect(
      appointments,
      new ScheduleResource(schedule),
    );
  }

  @ApiOperation({ summary: 'Get matched appointments by expert id and date' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('appointments/matched/:authExpertId/:expertId/:date')
  public async getMatchedAppointments(
    @Param('authExpertId', ParseIntPipe) authExpertId: number,
    @Param('expertId', ParseIntPipe) expertId: number,
    @Param('date') date: string,
  ): Promise<{}> {
    const { schedule, appointments } =
      await this.scheduleService.fetchMatchedAppointments(
        authExpertId,
        expertId,
        date,
      );

    return AppointmentResource.collect(
      appointments,
      new ScheduleResource(schedule),
    );
  }

  @ApiOperation({ summary: 'Change appointment status' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Patch('appointment/status/:appointmentId/:status')
  public async changeAppointmentStatus(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Param('status') status: string,
  ): Promise<AppointmentResource> {
    const appointment = await this.scheduleService.changeAppointmentStatus(
      appointmentId,
      status,
    );

    return new AppointmentResource(appointment);
  }

  @ApiOperation({ summary: 'Create Reserved Appointment' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Post('appointment/book')
  public async saveReservedAppointment(
    @Body() appointmentReservationDto: AppointmentReservationCreateDto,
  ) {
    const appointment = await this.scheduleService.bookAppointment(
      appointmentReservationDto,
    );

    return new AppointmentResource(appointment);
  }

  @ApiOperation({ summary: 'Edit Reserved Appointment' })
  @UseGuards(AuthGuard, ClientGuard)
  @ApiBearerAuth('Authorization')
  @Patch('appointment/book/:reservedAppointmentId')
  public async editReservedAppointment(
    @Body() appointmentReservationDto: AppointmentReservationCreateDto,
    @Param('reservedAppointmentId', ParseIntPipe) reservedAppointmentId: number,
  ) {
    const appointment = await this.scheduleService.updateReservedAppointment(
      appointmentReservationDto,
      reservedAppointmentId,
    );

    return new AppointmentResource(appointment);
  }

  @ApiOperation({ summary: 'Get Reserved Appointment' })
  @UseGuards(AuthGuard, ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('appointment/book/:appointmentId')
  public async getReservedAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    const reservedAppointment =
      await this.scheduleService.findReservedAppointment(appointmentId);
    if (!reservedAppointment) {
      throw new HttpException(
        'Reserved appointment was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return new AppointmentReservationResource(reservedAppointment);
  }
}
