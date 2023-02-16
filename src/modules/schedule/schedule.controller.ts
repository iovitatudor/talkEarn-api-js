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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ScheduleService } from './schedule.service';
import { ScheduleCreateDto } from './dto/schedule-create.dto';
import { ScheduleResource } from './resources/schedule.resource';
import { AppointmentResource } from './resources/appointment.resource';
import { ScheduleTemplateResource } from './resources/schedule-template.resource';

@ApiTags('Schedule')
@Controller('api')
export class ScheduleController {
  public constructor(private scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Create schedule' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Post('schedule')
  public async createSchedule(@Body() scheduleDto: ScheduleCreateDto): Promise<ScheduleResource[]> {
    const schedule = await this.scheduleService.storeSchedule(scheduleDto);
    return ScheduleResource.collect(schedule);
  }

  @ApiOperation({ summary: 'Get schedule per expert' })
  @UseGuards(AuthGuard)
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
    const scheduleTemplate = await this.scheduleService.fetchScheduleTemplate(day, expertId);
    return new ScheduleTemplateResource(scheduleTemplate);
  }

  @ApiOperation({ summary: 'Get all schedule templates per expert' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('schedule/templates/:expertId')
  public async getScheduleTemplates(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<ScheduleTemplateResource[]> {
    const scheduleTemplates = await this.scheduleService.fetchScheduleTemplates(expertId);
    return ScheduleTemplateResource.collect(scheduleTemplates);
  }

  @ApiOperation({ summary: 'Get appointments by expert id and date' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('appointments/:expertId/:date')
  public async getAppointments(
    @Param('expertId', ParseIntPipe) expertId: number,
    @Param('date') date: string,
  ): Promise<{}> {
    const { schedule, appointments } =
      await this.scheduleService.fetchAppointments(expertId, date);

    return AppointmentResource.collect(
      appointments,
      new ScheduleResource(schedule),
    );
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
}
