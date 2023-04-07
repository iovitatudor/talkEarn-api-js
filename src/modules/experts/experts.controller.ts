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
import { ExpertVideoAddDto } from './dto/expert-video-add.dto';
import { ExpertDeviceTokenAddDto } from './dto/expert-device-token-add.dto';
import { SetupGuard } from '../auth/guards/setup.guard';

@ApiTags('Experts')
@Controller('api')
export class ExpertsController {
  public constructor(private expertService: ExpertsService) {}

  @ApiOperation({ summary: 'Get all experts per project' })
  @UseGuards(ClientGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts')
  public async getAll(@Query() query) {
    const page = query.page;
    const active = query.active;
    const available = query.available;
    const recommended = query.recommended;
    const categoryId = query.category_id;
    const showIfNotTranslation = query.show_translation;
    const experts = await this.expertService.getAll(
      page,
      active,
      available,
      recommended,
      categoryId,
      showIfNotTranslation,
    );
    return ExpertsResource.collect(experts.data, experts.meta);
  }

  @ApiOperation({ summary: 'Add/Edit expert video' })
  @UseGuards(AuthGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @Patch('expert/video/:id')
  public async updateVideo(
    @Body() expertDto: ExpertVideoAddDto,
    @UploadedFile() video: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.saveVideo(
      id,
      video,
      expertDto.langId,
    );
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Get expert by id' })
  @UseGuards(ClientGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @Get('expert/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.findById(id);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Get expert by Slug' })
  @UseGuards(ClientGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @Get('expert/slug/:slug')
  public async getBySlug(
    @Param('slug') slug: string,
    @Query() query,
  ): Promise<ExpertsResource> {
    const showIfNotTranslation = query.show_translation;
    const expert = await this.expertService.findBySlug(slug, showIfNotTranslation);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Create expert' })
  @UseGuards(AuthGuard, AdministratorGuard, SetupGuard)
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
  public async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.toggleStatus(id);
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Add device token' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(201)
  @Patch('expert/device-token/:id')
  public async editDeviceToken(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: ExpertDeviceTokenAddDto,
  ): Promise<ExpertsResource> {
    const expert = await this.expertService.updateDeviceToken(
      id,
      expertDto.deviceToken,
    );
    return new ExpertsResource(expert);
  }

  @ApiOperation({ summary: 'Search experts per project' })
  @UseGuards(ClientGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts/search')
  public async search(@Query() query) {
    const page = query.page;
    const search = query.search;

    const experts = await this.expertService.search(page, search);
    return ExpertsResource.collect(experts.data, experts.meta);
  }

  @ApiOperation({ summary: "Get expert's supervisee" })
  @UseGuards(ClientGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts/supervisee/:expertId')
  public async getSuperviseeByExpert(
    @Param('expertId', ParseIntPipe) expertId: number,
  ) {
    const supervisee = await this.expertService.getSuperviseeByExpertId(
      expertId,
    );
    return ExpertsResource.collect(supervisee);
  }

  @ApiOperation({ summary: "Get expert's supervisors" })
  @UseGuards(ClientGuard, SetupGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts/supervisors/:expertId')
  public async getSupervisorsByExpert(
    @Param('expertId', ParseIntPipe) expertId: number,
  ) {
    const supervisors = await this.expertService.getSupervisorsByExpertId(
      expertId,
    );
    return ExpertsResource.collect(supervisors);
  }
}
