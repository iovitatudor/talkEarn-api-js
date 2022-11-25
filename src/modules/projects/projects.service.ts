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
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project,
  ) {}

  async getAll() {
    return this.projectRepository.findAll({
      // include: [
      //   {
      //     model: Expert,
      //     as: 'experts',
      //     attributes: [
      //       'name',
      //       'email',
      //       ['available', 'online'],
      //       'profession',
      //       'price',
      //     ],
      //   },
      // ],
      attributes: ['id', 'name', 'url', 'mode'],
    });
  }

  async getById(id) {
    return this.projectRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'url', 'mode'],
    });
  }

  async create(dto: ProjectCreateDto) {
    return this.projectRepository.create(dto);
  }

  async update(id: number, projectDto: ProjectUpdateDto) {
    if (id !== AuthGuard.projectId) {
      throw new UnauthorizedException({ message: 'Unauthorized!' });
    }
    await this.validateProject(projectDto.name, id);
    await this.projectRepository.update(projectDto, {
      where: { id },
    });
    return await this.getById(id);
  }

  async delete(id: number) {
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

  async getByName(name: string) {
    return await this.projectRepository.findOne({ where: { name } });
  }

  private async validateProject(projectName, id) {
    const project = await this.getByName(projectName);
    if (project && project.id !== id) {
      throw new HttpException(
        'Project name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
