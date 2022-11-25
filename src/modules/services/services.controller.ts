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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ServicesService } from './services.service';
import { ServiceCreateDto } from './dto/service-create.dto';

@ApiTags('Services')
@Controller('api')
export class ServicesController {
  public constructor(private servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Get all services per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('services')
  public getAll() {
    return this.servicesService.getAll();
  }

  @ApiOperation({ summary: 'Get service by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('service/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findById(id);
  }

  @ApiOperation({ summary: 'Create service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Post('service')
  public create(@Body() serviceDto: ServiceCreateDto) {
    return this.servicesService.store(serviceDto);
  }

  @ApiOperation({ summary: 'Update service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Patch('service/:id')
  public edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() serviceDto: ServiceCreateDto,
  ) {
    return this.servicesService.update(id, serviceDto);
  }

  @ApiOperation({ summary: 'Delete service' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Delete('service/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.destroy(id);
  }
}
