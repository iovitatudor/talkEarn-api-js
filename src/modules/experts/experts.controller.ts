import {
  Body,
  Controller,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExpertsService } from './experts.service';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Experts')
@Controller('api')
export class ExpertsController {
  public constructor(private expertService: ExpertsService) {}

  @ApiOperation({ summary: 'Get all experts per project' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('experts')
  public getAll() {
    return this.expertService.getAll();
  }

  @ApiOperation({ summary: 'Get expert by Id' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('expert/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.expertService.findById(id);
  }

  @ApiOperation({ summary: 'Create expert' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Post('expert')
  public create(@Body() expertDto: ExpertCreateDto) {
    return this.expertService.store(expertDto);
  }

  @ApiOperation({ summary: 'Update expert' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Patch('expert/:id')
  public edit(@Param('id', ParseIntPipe) id: number, @Body() expertDto: ExpertUpdateDto) {
    return this.expertService.update(id, expertDto);
  }

  @ApiOperation({ summary: 'Delete expert' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @Delete('expert/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.expertService.destroy(id);
  }
}
