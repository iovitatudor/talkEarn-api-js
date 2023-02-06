import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Parameter } from './models/parameters.model';
import { ParameterCreateDto } from './dto/parameter-create.dto';
import { ParameterUpdateDto } from './dto/parameter-update.dto';
import { ParameterExpertCreateDto } from './dto/parameter-expert-create.dto';
import { ExpertsService } from '../experts/experts.service';
import { ParameterExpert } from './models/parameter-expert.model';
import { ParameterExpertTranslation } from './models/parameter-expert-translations.model';
import { GlobalData } from '../auth/guards/global-data';
import {Language} from "../languages/models/languages.model";

@Injectable()
export class ParametersService {
  constructor(
    @InjectModel(Parameter) private parameterRepository: typeof Parameter,
    @InjectModel(ParameterExpert)
    private parameterExpertRepository: typeof ParameterExpert,
    @InjectModel(ParameterExpertTranslation)
    private parameterExpertTranslationRepository: typeof ParameterExpertTranslation,
    private expertService: ExpertsService,
  ) {}

  public async getAll(): Promise<Parameter[]> {
    return await this.parameterRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(parameterId: number): Promise<Parameter> {
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

  public async store(parameterDto: ParameterCreateDto): Promise<Parameter> {
    const parameter = await this.parameterRepository.create({
      ...parameterDto,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(parameter.id);
  }

  public async update(
    parameterId: number,
    parameterDto: ParameterUpdateDto,
  ): Promise<Parameter> {
    await this.findById(parameterId);

    await this.parameterRepository.update(parameterDto, {
      where: { id: parameterId, project_id: AuthGuard.projectId },
    });

    return await this.findById(parameterId);
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);
    return await this.parameterRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  private async findParameterValueByExpertId(
    parameterId: number,
    expertId: number,
  ): Promise<ParameterExpert> {
    return await this.parameterExpertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { parameter_id: parameterId, expert_id: expertId },
      include: [
        {
          model: ParameterExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
  }

  public async addParameterValue(
    parameterId: number,
    expertId: number,
    parameterExpertDto: ParameterExpertCreateDto,
  ): Promise<ParameterExpert> {
    const parameter = await this.findById(parameterId);
    const expert = await this.expertService.findById(expertId);
    const parameterExpert = await this.findParameterValueByExpertId(
      parameter.id,
      expert.id,
    );

    if (!parameterExpert) {
      const paramExpert = await this.parameterExpertRepository.create({
        parameter_id: parameter.id,
        expert_id: expert.id,
      });

      for (const language of GlobalData.languages) {
        await this.parameterExpertTranslationRepository.create({
          parameter_expert_id: paramExpert.id,
          lang_id: language.id,
          ...parameterExpertDto,
        });
      }
    } else {
      await this.parameterExpertTranslationRepository.update(
        parameterExpertDto,
        {
          returning: undefined,
          where: {
            parameter_expert_id: parameterExpert.id,
            lang_id: parameterExpertDto.langId,
          },
        },
      );
    }

    return await this.findParameterValueByExpertId(parameter.id, expert.id);
  }

  public async getParametersByExpertId(
    expertId: number,
  ): Promise<ParameterExpert[]> {
    await this.expertService.findById(expertId);

    return await this.parameterExpertRepository.findAll({
      where: { expert_id: expertId },
      include: [
        {
          model: ParameterExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
  }

  public async addBulkParameters(
    expertId: number,
    parameters: Array<any>,
    langId: number,
  ) {
    await this.expertService.findById(expertId);

    parameters.map(async (parameter) => {
      const parameterExpert = await this.findParameterValueByExpertId(
        parameter.id,
        expertId,
      );

      if (!parameterExpert) {
        const paramExpert = await this.parameterExpertRepository.create({
          parameter_id: parameter.id,
          expert_id: expertId,
        });

        for (const language of GlobalData.languages) {
          await this.parameterExpertTranslationRepository.create({
            parameter_expert_id: paramExpert.id,
            lang_id: language.id,
            value: parameter.value,
          });
        }
      } else {
        await this.parameterExpertTranslationRepository.update(
          { value: parameter.value },
          {
            returning: undefined,
            where: {
              parameter_expert_id: parameterExpert.id,
              lang_id: langId,
            },
          },
        );
      }
    });

    return true;
  }

  public async addNewTranslations(language: Language) {
    const serviceTranslations =
      await this.parameterExpertTranslationRepository.findAll({
        where: { lang_id: GlobalData.langId },
      });

    for (const serviceTranslation of serviceTranslations) {
      await this.parameterExpertTranslationRepository.create({
        parameter_expert_id: serviceTranslation.parameter_expert_id,
        lang_id: language.id,
        value: serviceTranslation.value,
      });
    }
  }

  public async deleteTranslations(language: Promise<Language>) {
    return await this.parameterExpertTranslationRepository.destroy({
      where: { lang_id: (await language).id },
    });
  }
}
