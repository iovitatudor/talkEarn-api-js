import {
  Controller,
  Body,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe, HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoriesResource } from './resources/categories.resource';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Categories')
@Controller('api')
export class CategoriesController {
  public constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories per project ' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('categories')
  public async getAll() {
    const categories = await this.categoriesService.getAll();
    return CategoriesResource.collect(categories);
  }

  @ApiOperation({ summary: 'Get category by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('category/:id')
  public async getById(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findById(id);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Post('category')
  public async create(@Body() expertDto: CategoryCreateDto) {
    const category = await this.categoriesService.store(expertDto);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Patch('category/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: CategoryUpdateDto,
  ) {
    const category = await this.categoriesService.update(id, expertDto);
    return new CategoriesResource(category);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('category/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.destroy(id);
  }
}
