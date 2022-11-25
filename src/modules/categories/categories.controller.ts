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
import { CategoriesService } from './categories.service';
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
  public getAll() {
    return this.categoriesService.getAll();
  }

  @ApiOperation({ summary: 'Get category by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('category/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Post('category')
  public create(@Body() expertDto: CategoryCreateDto) {
    return this.categoriesService.store(expertDto);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Patch('category/:id')
  public edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() expertDto: CategoryUpdateDto,
  ) {
    return this.categoriesService.update(id, expertDto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Delete('category/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.destroy(id);
  }
}
