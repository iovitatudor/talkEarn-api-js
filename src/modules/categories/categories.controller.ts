import {
  Body,
  Controller,
  Param,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  public constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get All Categories' })
  @Get('categories')
  public getAll() {
    return this.categoriesService.getAll();
  }

  @ApiOperation({ summary: 'Get Category by Id' })
  @Get('category/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }

  @ApiOperation({ summary: 'Create Category' })
  @Post('category')
  public create(@Body() expertDto: CategoryCreateDto) {
    return this.categoriesService.store(expertDto);
  }

  @ApiOperation({ summary: 'Update Expert' })
  @Patch('category/:id')
  public edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: CategoryUpdateDto,
  ) {
    return this.categoriesService.update(id, expertDto);
  }

  @ApiOperation({ summary: 'Delete Expert' })
  @Delete('category/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.destroy(id);
  }
}
