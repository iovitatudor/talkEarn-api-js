import {
  Body,
  Controller,
  Param,
  UseGuards,
  HttpCode,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExpertsService } from './experts.service';
import { ExpertsResource } from './resources/experts.resource';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';

@ApiTags('Experts')
@Controller('api')
export class ExpertsController {
  public constructor(private expertService: ExpertsService) {}

  @ApiOperation({ summary: 'Get all experts per project' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts')
  public async getAll(): Promise<ExpertsResource[]> {
    const experts = await this.expertService.getAll();
    return ExpertsResource.collect(experts);
  }

  @ApiOperation({ summary: 'Get expert by Id' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('expert/:id')
  public async getById(@Param('id', ParseIntPipe) id: number): Promise<ExpertsResource> {
    const expert = await this.expertService.findById(id);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Create expert' })
  @UseGuards(AuthGuard, AdministratorGuard)
  @ApiBearerAuth('Authorization')
  @Post('expert')
  public async create(@Body() expertDto: ExpertCreateDto): Promise<ExpertsResource> {
    const expert = await this.expertService.store(expertDto);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Update expert' })
  @UseGuards(AuthGuard, AdministratorGuard)
  @ApiBearerAuth('Authorization')
  @Patch('expert/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: ExpertUpdateDto,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.update(id, expertDto);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Delete expert' })
  @UseGuards(AuthGuard, AdministratorGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(204)
  @Delete('expert/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.expertService.destroy(id);
  }
}
