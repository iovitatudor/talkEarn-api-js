import {
  Controller,
  Body,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  ParseIntPipe, HttpCode,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ServicesService } from './services.service';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceResource } from './resources/services.resource';
import { Response } from 'express';

@ApiTags('Services')
@Controller('api')
export class ServicesController {
  public constructor(private servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Get all services per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('services')
  public async getAll() {
    const services = await this.servicesService.getAll();
    return ServiceResource.collect(services);
  }

  @ApiOperation({ summary: 'Get service by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('service/:id')
  public async getById(@Param('id', ParseIntPipe) id: number) {
    const service = await this.servicesService.findById(id);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Create service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Post('service')
  public async create(@Body() serviceDto: ServiceCreateDto) {
    const service = await this.servicesService.store(serviceDto);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Update service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Patch('service/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() serviceDto: ServiceCreateDto,
  ) {
    const service = await this.servicesService.update(id, serviceDto);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Delete service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('service/:id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.servicesService.destroy(id);
  }

  @ApiOperation({ summary: 'Get services by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('services/expert/:expertId')
  public async getExpertServices(@Param('expertId', ParseIntPipe) expertId: number) {
    const services = await this.servicesService.findServicesByExpertId(
      expertId,
    );
    return ServiceResource.collect(services);
  }
}
