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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExpertsService } from './experts.service';
import { ExpertsResource } from './resources/experts.resource';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { FileInterceptor} from "@nestjs/platform-express";
import { Express } from 'express';
import {Expert} from "./models/experts.model";

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('expert')
  public async create(
    @Body() expertDto: ExpertCreateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.store(expertDto, avatar);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Update expert' })
  @UseGuards(AuthGuard, AdministratorGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('expert/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: ExpertUpdateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.update(id, expertDto, avatar);
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

  @ApiOperation({ summary: 'Toggle expert status' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(201)
  @Patch('expert/status/:id')
  public async toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<ExpertsResource> {
    const expert = await this.expertService.toggleStatus(id);
    return new ExpertsResource(expert);
  }
}
