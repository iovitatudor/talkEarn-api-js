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
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { ParametersService } from './parameters.service';
import { ExpertParametersResource } from './resources/expert-parameters.resource';
import { ParameterCreateDto } from './dto/parameter-create.dto';
import { ParameterUpdateDto } from './dto/parameter-update.dto';
import { ParameterExpertCreateDto } from './dto/parameter-expert-create.dto';
import { ParametersResource } from './resources/parameters.resource';
import { SetupGuard } from '../auth/guards/setup.guard';
import {ParameterCreateBulkDto} from "./dto/parameter-create-bulk.dto";

@ApiTags('Parameters')
@Controller('api')
export class ParametersController {
  public constructor(private parametersService: ParametersService) {}

  @ApiOperation({ summary: 'Get all parameters per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('parameters')
  public async getAll(): Promise<ParametersResource[]> {
    const parameters = await this.parametersService.getAll();
    return ParametersResource.collect(parameters);
  }

  @ApiOperation({ summary: 'Get parameter by id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('parameter/:id')
  public async getById(@Param('id', ParseIntPipe) id: number): Promise<ParametersResource> {
    const parameter = await this.parametersService.findById(id);
    return new ParametersResource(parameter);
  }

  @ApiOperation({ summary: 'Create parameter' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('parameter')
  public async create(
    @Body() parameterDto: ParameterCreateDto,
  ): Promise<ParametersResource> {
    const parameter = await this.parametersService.store(parameterDto);
    return new ParametersResource(parameter);
  }

  @ApiOperation({ summary: 'Update parameter' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('parameter/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() parameterDto: ParameterUpdateDto,
  ): Promise<ParametersResource> {
    const parameter = await this.parametersService.update(id, parameterDto);
    return new ParametersResource(parameter);
  }

  @ApiOperation({ summary: 'Delete parameter' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('parameter/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.parametersService.destroy(id);
  }

  @ApiOperation({ summary: 'Set parameter value and assign to an expert' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Post('parameter/:parameterId/expert/:expertId')
  public async setParameterValue(
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Param('expertId', ParseIntPipe) expertId: number,
    @Body() parameterExpertDto: ParameterExpertCreateDto,
  ): Promise<ExpertParametersResource> {
    const parameter = await this.parametersService.addParameterValue(
      parameterId,
      expertId,
      parameterExpertDto,
    );
    return new ExpertParametersResource(parameter);
  }

  @ApiOperation({
    summary: 'Set bulk parameter values and assign to an expert',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Post('parameter/expert/:expertId')
  public async setBulkParameterValue(
    @Param('expertId', ParseIntPipe) expertId: number,
    @Body() parameterCreateBulkDto: ParameterCreateBulkDto,
  ) {
    return await this.parametersService.addBulkParameters(
      expertId,
      parameterCreateBulkDto.parameters,
      parameterCreateBulkDto.langId,
    );
  }

  @ApiOperation({ summary: 'Get parameters by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Get('parameters/expert/:expertId')
  public async getExpertsParameters(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<ExpertParametersResource[]> {
    const parameters = await this.parametersService.getParametersByExpertId(
      expertId,
    );
    return ExpertParametersResource.collect(parameters);
  }
}
