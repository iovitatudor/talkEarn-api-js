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
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CollectionsResource } from './resources/collections.resource';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { CollectionUpdateDto } from './dto/collection-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ClientGuard } from '../auth/guards/client.guard';

@ApiTags('Collections')
@Controller('api')
export class CollectionsController {
  public constructor(private collectionsService: CollectionsService) {}

  @ApiOperation({ summary: 'Get all collections per project' })
  @ApiResponse({ status: 200, type: [CollectionsResource] })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('collections')
  public async getAll(): Promise<CollectionsResource[]> {
    const collections = await this.collectionsService.getAll();
    return CollectionsResource.collect(collections);
  }

  @ApiOperation({ summary: 'Get collection by Id' })
  @ApiResponse({ status: 200, type: CollectionsResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('collection/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CollectionsResource> {
    const collection = await this.collectionsService.findById(id);
    return new CollectionsResource(collection);
  }

  @ApiOperation({ summary: 'Get collection by slug' })
  @ApiResponse({ status: 200, type: CollectionsResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('collection/slug/:slug')
  public async getBySlug(
    @Param('slug') slug: string,
  ): Promise<CollectionsResource> {
    const collection = await this.collectionsService.findBySlug(slug);
    return new CollectionsResource(collection);
  }

  @ApiOperation({ summary: 'Create collection' })
  @ApiResponse({ status: 200, type: CollectionsResource })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('collection')
  public async create(
    @Body() collectionDto: CollectionCreateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CollectionsResource> {
    const collection = await this.collectionsService.store(collectionDto, image);
    return new CollectionsResource(collection);
  }

  @ApiOperation({ summary: 'Update collection' })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('collection/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() collectionDto: CollectionUpdateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CollectionsResource> {
    const collection = await this.collectionsService.update(id, collectionDto, image);
    return new CollectionsResource(collection);
  }

  @ApiOperation({ summary: 'Delete collection' })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(204)
  @Delete('collection/:id')
  public delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.collectionsService.destroy(id);
  }
}
