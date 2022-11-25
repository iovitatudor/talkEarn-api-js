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
import { AuthGuard } from '../auth/auth.guard';
import { ParametersService } from './parameters.service';
import { ParameterCreateDto } from './dto/parameter-create.dto';
import { ParameterUpdateDto } from './dto/parameter-update.dto';

@ApiTags('Parameters')
@Controller('api')
export class ParametersController {
  public constructor(private parametersService: ParametersService) {}

  @ApiOperation({ summary: 'Get all parameters per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('parameters')
  public getAll() {
    return this.parametersService.getAll();
  }

  @ApiOperation({ summary: 'Get parameter by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('parameter/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.parametersService.findById(id);
  }

  @ApiOperation({ summary: 'Create parameter' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Post('parameter')
  public create(@Body() parameterDto: ParameterCreateDto) {
    return this.parametersService.store(parameterDto);
  }

  @ApiOperation({ summary: 'Update parameter' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Patch('parameter/:id')
  public edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() parameterDto: ParameterUpdateDto,
  ) {
    return this.parametersService.update(id, parameterDto);
  }

  @ApiOperation({ summary: 'Delete parameter' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Delete('parameter/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.parametersService.destroy(id);
  }
}
