import {
  Controller,
  Body,
  Param,
  UseGuards,
  HttpCode,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SetupGuard } from 'src/modules/auth/guards/setup.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { SupervisorsService } from '../services/supervisors.service';
import { SupervisorResource } from '../resources/supervisor.resource';
import { SupervisorNotificationCreateDto } from '../dto/supervisor-notification-create.dto';
import { SupervisorNotificationUpdateDto } from '../dto/supervisor-notification-update.dto';

@ApiTags('Notifications')
@Controller('api/notifications')
export class SupervisorsController {
  public constructor(private supervisorsService: SupervisorsService) {}

  @ApiOperation({ summary: 'Get all supervisors notifications by expert id' })
  @ApiResponse({ status: 200, type: [SupervisorResource] })
  @ApiBearerAuth('Authorization')
  @UseGuards(SetupGuard)
  @Get('supervisors/:expertId')
  public async getAll(
    @Param('expertId', ParseIntPipe) expertId: number,
    @Query() query,
  ): Promise<SupervisorResource[]> {
    const status = query.status;
    const notifications = await this.supervisorsService.getAllByExpertId(
      expertId,
      status,
    );
    return SupervisorResource.collect(notifications);
  }

  @ApiOperation({ summary: 'Get supervisor notification by id' })
  @ApiResponse({ status: 200, type: SupervisorResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(SetupGuard)
  @Get('supervisor/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupervisorResource> {
    const notification = await this.supervisorsService.findById(id);
    return new SupervisorResource(notification);
  }

  @ApiOperation({ summary: 'Create supervisor notification' })
  @ApiResponse({ status: 200, type: SupervisorResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Post('supervisor')
  public async create(
    @Body() notificationDto: SupervisorNotificationCreateDto,
  ): Promise<SupervisorResource> {
    const notification = await this.supervisorsService.store(notificationDto);
    return new SupervisorResource(notification);
  }

  @ApiOperation({ summary: 'Update supervisor notification' })
  @ApiResponse({ status: 201, type: SupervisorResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Patch('supervisor/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() notificationDto: SupervisorNotificationUpdateDto,
  ): Promise<SupervisorResource> {
    const notification = await this.supervisorsService.update(
      id,
      notificationDto,
    );
    return new SupervisorResource(notification);
  }

  @ApiOperation({ summary: 'Delete supervisor notification' })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('supervisor/:id')
  public delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.supervisorsService.destroy(id);
  }

  @ApiOperation({ summary: 'Allow supervisor request' })
  @ApiResponse({ status: 200, type: SupervisorResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Patch('supervisor/allow/:notificationId')
  public async allowSupervisorRequest(
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<SupervisorResource> {
    const notification = await this.supervisorsService.allowSupervisorRequest(
      notificationId,
    );
    return new SupervisorResource(notification);
  }
}
