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
import { CategoriesService } from './categories.service';
import { CategoriesResource } from './resources/categories.resource';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ClientGuard } from '../auth/guards/client.guard';

@ApiTags('Categories')
@Controller('api')
export class CategoriesController {
  public constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories per project' })
  @ApiResponse({ status: 200, type: [CategoriesResource] })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('categories')
  public async getAll(): Promise<CategoriesResource[]> {
    const categories = await this.categoriesService.getAll();
    return CategoriesResource.collect(categories);
  }

  @ApiOperation({ summary: 'Get category by Id' })
  @ApiResponse({ status: 200, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('category/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoriesResource> {
    const category = await this.categoriesService.findById(id);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('category/slug/:slug')
  public async getBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoriesResource> {
    const category = await this.categoriesService.findBySlug(slug);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 200, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('category')
  public async create(
    @Body() categoryDto: CategoryCreateDto,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<CategoriesResource> {
    const category = await this.categoriesService.store(categoryDto, icon);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 201, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('category/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: CategoryUpdateDto,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<CategoriesResource> {
    const category = await this.categoriesService.update(id, categoryDto, icon);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(204)
  @Delete('category/:id')
  public delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.categoriesService.destroy(id);
  }
}
