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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ServicesService } from './services.service';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceResource } from './resources/services.resource';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ServiceUpdateDto } from './dto/service-update.dto';
import { ClientGuard } from '../auth/guards/client.guard';
import { SetupGuard } from '../auth/guards/setup.guard';

@ApiTags('Services')
@Controller('api')
export class ServicesController {
  public constructor(private servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Get all services per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('services')
  public async getAll(): Promise<ServiceResource[]> {
    const services = await this.servicesService.getAll();
    return ServiceResource.collect(services);
  }

  @ApiOperation({ summary: 'Get service by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('service/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.findById(id);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Get service by hash' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('service/hash/:hash')
  public async getByHash(
    @Param('hash') hash: string,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.findByHash(hash);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Create service' })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(AuthGuard, SetupGuard)
  @Post('service')
  public async create(
    @Body() serviceDto: ServiceCreateDto,
    @UploadedFile() video: Express.Multer.File,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.store(serviceDto, video);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Update service' })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(AuthGuard, SetupGuard)
  @Patch('service/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() serviceDto: ServiceUpdateDto,
    @UploadedFile() video: Express.Multer.File,
  ): Promise<ServiceResource> {
    const service = await this.servicesService.update(id, serviceDto, video);
    return new ServiceResource(service);
  }

  @ApiOperation({ summary: 'Delete service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('service/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.servicesService.destroy(id);
  }

  @ApiOperation({ summary: 'Get services by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
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
