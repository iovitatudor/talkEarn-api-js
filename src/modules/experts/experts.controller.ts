import {
  Body,
  Controller,
  Param,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Query,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpertsService } from './experts.service';
import { ExpertsResource } from './resources/experts.resource';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { Express } from 'express';
import { ClientGuard } from '../auth/guards/client.guard';
import {ExpertVideoAddDto} from "./dto/expert-video-add.dto";

@ApiTags('Experts')
@Controller('api')
export class ExpertsController {
  public constructor(private expertService: ExpertsService) {}

  @ApiOperation({ summary: 'Get all experts per project' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts')
  public async getAll(@Query() query) {
    const page = query.page;
    const limit = query.limit;
    const active = query.active;
    const online = query.online;
    const recommended = query.recommended;
    const category_id = query.category_id;

    const experts = await this.expertService.getAll(
      limit,
      page,
      active,
      online,
      recommended,
      category_id,
    );
    return ExpertsResource.collect(experts.data, experts.meta);
  }

  @ApiOperation({ summary: 'Add/Edit expert video' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @Patch('expert/video/:id')
  public async updateVideo(
    @Body() expertDto: ExpertVideoAddDto,
    @UploadedFile() video: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.saveVideo(id, video);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Get expert by Id' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('expert/:id')
  public async getById(@Param('id', ParseIntPipe) id: number): Promise<ExpertsResource> {
    const expert = await this.expertService.findById(id);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Get expert by Slug' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('expert/slug/:slug')
  public async getBySlug(@Param('slug') slug: string): Promise<ExpertsResource> {
    const expert = await this.expertService.findBySlug(slug);
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
  @UseGuards(AuthGuard)
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

  @ApiOperation({ summary: 'Search experts per project' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts/search')
  public async search(@Query() query) {
    const page = query.page;
    const search = query.search;

    const experts = await this.expertService.search(page, search);
    return ExpertsResource.collect(experts.data, experts.meta);
  }
}
