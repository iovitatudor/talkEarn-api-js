import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Parameter } from './models/parameters.model';
import { ParameterCreateDto } from './dto/parameter-create.dto';
import { ParameterUpdateDto } from './dto/parameter-update.dto';

@Injectable()
export class ParametersService {
  constructor(
    @InjectModel(Parameter) private parameterRepository: typeof Parameter,
  ) {}

  public async getAll() {
    return await this.parameterRepository.findAll({
      where: { project_id: AuthGuard.projectId },
    });
  }

  public async findById(id: number) {
    return await this.parameterRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async destroy(id: number) {
    return await this.parameterRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async store(parameterDto: ParameterCreateDto) {
    return this.parameterRepository.create({
      ...parameterDto,
      project_id: Number(AuthGuard.projectId),
    });
  }

  public async update(id: number, parameterDto: ParameterUpdateDto) {
    await this.parameterRepository.update(parameterDto, {
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
