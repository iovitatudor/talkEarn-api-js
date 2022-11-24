import {
  Controller,
  Body,
  Param,
  Res,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { Project } from './models/projects.model';

@ApiTags('Projects')
@Controller('api')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get All Projects' })
  @ApiResponse({ status: 200, type: [Project] })
  @Get('/projects')
  public getAll() {
    return this.projectsService.getAll();
  }

  @ApiOperation({ summary: 'Get Project By Id' })
  @ApiResponse({ status: 200, type: [Project] })
  @Get('project/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getById(id);
  }

  @ApiOperation({ summary: 'Update Project' })
  @ApiResponse({ status: 201, type: Project })
  @Patch('project/:id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: ProjectUpdateDto,
  ) {
    return this.projectsService.update(id, projectDto);
  }

  @ApiOperation({ summary: 'Delete Project' })
  @ApiResponse({ status: 204, description: 'The project has been deleted.' })
  @Delete('project/:id')
  public async delete(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    await this.projectsService.delete(id);
    return response
      .status(HttpStatus.NO_CONTENT)
      .send('saving ' + JSON.stringify(id));
  }
}
