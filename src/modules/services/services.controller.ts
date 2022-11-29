import {
  Controller,
  Body,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ServicesService } from './services.service';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceResource } from './resources/services.resource';
import { AdministratorGuard } from '../auth/guards/administrator.guard';

@ApiTags('Services')
@Controller('api')
export class ServicesController {
  public constructor(private servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Get all services per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('services')
  public async getAll(): Promise<ServiceResource[]> {
    const services = await this.servicesService.getAll();
    return ServiceResource.collect(services);
  }

  @ApiOperation({ summary: 'Get service by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('service/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.findById(id);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Create service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('service')
  public async create(
    @Body() serviceDto: ServiceCreateDto,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.store(serviceDto);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Update service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('service/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() serviceDto: ServiceCreateDto,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.update(id, serviceDto);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Delete service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(204)
  @Delete('service/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.servicesService.destroy(id);
  }

  @ApiOperation({ summary: 'Get services by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('services/expert/:expertId')
  public async getExpertServices(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<ServiceResource[]> {
    const services = await this.servicesService.findServicesByExpertId(
      expertId,
    );
    return ServiceResource.collect(services);
  }
}
