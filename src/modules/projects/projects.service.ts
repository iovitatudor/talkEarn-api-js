import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './models/projects.model';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project,
  ) {}

  async getAll(): Promise<Project[]> {
    return this.projectRepository.findAll({
      attributes: ['id', 'name', 'url', 'mode'],
      include: { all: true },
    });
  }

  async getById(projectId): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      attributes: ['id', 'name', 'url', 'mode'],
      include: { all: true },
    });
    if (!project) {
      throw new HttpException('Project was not found.', HttpStatus.BAD_REQUEST);
    }
    return project;
  }

  async create(projectDto: ProjectCreateDto): Promise<Project> {
    await this.validateProject(projectDto.name);
    return await this.projectRepository.create(projectDto);
  }

  async update(id: number, projectDto: ProjectUpdateDto): Promise<Project> {
    await this.getById(id);
    if (id !== AuthGuard.projectId) {
      throw new UnauthorizedException({ message: 'Unauthorized!' });
    }
    await this.validateProject(projectDto.name, id);
    await this.projectRepository.update(projectDto, {
      where: { id },
    });
    return await this.getById(id);
  }

  async delete(id: number): Promise<number> {
    await this.getById(id);
    if (id !== AuthGuard.projectId) {
      throw new UnauthorizedException({ message: 'Unauthorized!' });
    }
    // delete all experts
    // delete all categories
    // delete all services
    // delete all contacts
    // delete all parameters
    return await this.projectRepository.destroy({ where: { id } });
  }

  async getByName(name: string): Promise<Project> {
    return await this.projectRepository.findOne({ where: { name } });
  }

  private async validateProject(projectName, id = 0): Promise<void> {
    const project = await this.getByName(projectName);
    if (project && project.id !== id) {
      throw new HttpException(
        'Project name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
