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
} from '@nestjs/common';
import {
  ApiBearerAuth,
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

@ApiTags('Categories')
@Controller('api')
export class CategoriesController {
  public constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories per project' })
  @ApiResponse({ status: 200, type: [CategoriesResource] })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('categories')
  public async getAll(): Promise<CategoriesResource[]> {
    const categories = await this.categoriesService.getAll();
    return CategoriesResource.collect(categories);
  }

  @ApiOperation({ summary: 'Get category by Id' })
  @ApiResponse({ status: 200, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('category/:id')
  public async getById(@Param('id', ParseIntPipe) id: number): Promise<CategoriesResource> {
    const category = await this.categoriesService.findById(id);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 200, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('category')
  public async create(@Body() expertDto: CategoryCreateDto): Promise<CategoriesResource> {
    const category = await this.categoriesService.store(expertDto);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 201, type: CategoriesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('category/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: CategoryUpdateDto,
  ): Promise<CategoriesResource> {
    const category = await this.categoriesService.update(id, expertDto);
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
