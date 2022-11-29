import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Parameter } from './models/parameters.model';
import { ParameterCreateDto } from './dto/parameter-create.dto';
import { ParameterUpdateDto } from './dto/parameter-update.dto';
import { ParameterExpertCreateDto } from './dto/parameter-expert-create.dto';
import { ExpertsService } from '../experts/experts.service';
import { ParameterExpert } from './models/parameter-expert';

@Injectable()
export class ParametersService {
  constructor(
    @InjectModel(Parameter) private parameterRepository: typeof Parameter,
    @InjectModel(ParameterExpert)
    private parameterExpertRepository: typeof ParameterExpert,
    private expertService: ExpertsService,
  ) {}

  public async getAll() {
    return await this.parameterRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(parameterId: number) {
    const parameter = await this.parameterRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: parameterId, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!parameter) {
      throw new HttpException(
        'Parameter was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return parameter;
  }

  public async destroy(id: number) {
    await this.findById(id);
    return await this.parameterRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(parameterDto: ParameterCreateDto) {
    const parameter = await this.parameterRepository.create({
      ...parameterDto,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(parameter.id);
  }

  public async update(parameterId: number, parameterDto: ParameterUpdateDto) {
    await this.findById(parameterId);

    await this.parameterRepository.update(parameterDto, {
      where: { id: parameterId, project_id: AuthGuard.projectId },
    });

    return await this.findById(parameterId);
  }

  private async findParameterValueByExpertId(
    parameterId: number,
    expertId: number,
  ) {
    return await this.parameterExpertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { parameter_id: parameterId, expert_id: expertId },
      include: { all: true },
    });
  }

  public async addParameterValue(
    parameterId: number,
    expertId: number,
    parameterExpertDto: ParameterExpertCreateDto,
  ) {
    const parameter = await this.findById(parameterId);
    const expert = await this.expertService.findById(expertId);
    const parameterExpert = await this.findParameterValueByExpertId(
      parameter.id,
      expert.id,
    );

    if (!parameterExpert) {
      await this.parameterExpertRepository.create({
        ...parameterExpertDto,
        parameter_id: parameter.id,
        expert_id: expert.id,
      });
    } else {
      await this.parameterExpertRepository.update(parameterExpertDto, {
        returning: undefined,
        where: { id: parameterExpert.id },
      });
    }

    return await this.findParameterValueByExpertId(parameter.id, expert.id);
  }

  public async getParametersByExpertId(expertId: number) {
    await this.expertService.findById(expertId);

    return await this.parameterExpertRepository.findAll({
      where: { expert_id: expertId },
      include: { all: true },
    });
  }
}
