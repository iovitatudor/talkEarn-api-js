import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expert } from '../models/experts.model';
import { ExpertTranslation } from '../models/experts-translations.model';
import { GlobalData } from '../../auth/guards/global-data';
import { ExpertCategory } from '../../categories/models/expert-categories.model';
import { ParameterExpert } from '../../parameters/models/parameter-expert.model';
import { Parameter } from '../../parameters/models/parameters.model';
import { ParameterExpertTranslation } from '../../parameters/models/parameter-expert-translations.model';
import { CategoryTranslation } from '../../categories/models/categories_translations.model';
import { ExpertCreateDto } from '../dto/expert-create.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { ExpertUpdateDto } from '../dto/expert-update.dto';
const { sequelize } = require('../sequelize/models');

@Injectable()
export class ExpertRepository {
  constructor(
    @InjectModel(Expert) private expertRepository: typeof Expert,
    @InjectModel(ExpertTranslation)
    private expertTranslationRepository: typeof ExpertTranslation,
    @Inject('SequelizeInstance') private readonly sequelizeInstance,
  ) {}

  private sequelize: Sequelize;

  private attributes: Array<string> = [
    'id',
    'supervisor_id',
    'slug',
    'email',
    'recommended',
    'active',
    'available',
    'avatar',
    'rating',
    'price',
    'type',
    'device_token',
  ];

  private include: Array<any> = [
    {
      model: ExpertTranslation,
      where: { lang_id: GlobalData.langId },
    },
    {
      model: ExpertCategory,
      include: [
        {
          model: CategoryTranslation,
          where: { lang_id: GlobalData.langId },
          required: false,
        },
      ],
    },
    {
      model: ParameterExpert,
      include: [
        { model: Parameter },
        {
          model: ParameterExpertTranslation,
          where: { lang_id: GlobalData.langId },
          required: false,
        },
      ],
    },
  ];

  public async getOne(where): Promise<Expert> {
    const expert = await this.expertRepository.findOne({
      where,
      attributes: this.attributes,
      include: this.include,
    });

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }
    return expert;
  }

  public async getMany(where, limit = 30, offset = 1): Promise<Expert[]> {
    return await this.expertRepository.findAll({
      where,
      limit,
      offset,
      attributes: this.attributes,
      include: this.include,
    });
  }

  public async create(expertDto: ExpertCreateDto): Promise<any> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const expert = await this.expertRepository.create(
        {
          ...expertDto,
          project_id: AuthGuard.projectId,
        },
        { transaction: transaction },
      );

      for (const language of GlobalData.languages) {
        await this.expertTranslationRepository.create(
          {
            expert_id: expert.id,
            lang_id: language.id,
            ...expertDto,
          },
          { transaction: transaction },
        );
      }

      await transaction.commit();
      return expert;
    } catch (e) {
      await transaction.rollback();
      throw new HttpException('An error occurred.', HttpStatus.BAD_REQUEST);
    }

    //   return await sequelize.transaction(async () => {
    //     const expert = await this.expertRepository.create({
    //       ...expertDto,
    //       project_id: AuthGuard.projectId,
    //     });
    //
    //     for (const language of GlobalData.languages) {
    //       await this.expertTranslationRepository.create({
    //         expert_id: expert.id,
    //         lang_id: language.id,
    //         ...expertDto,
    //       });
    //     }
    //     return expert;
    //   });
  }

  public async update(id: number, expertDto: ExpertUpdateDto): Promise<any> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      await this.expertRepository.update(expertDto, {
        returning: undefined,
        where: { id, project_id: AuthGuard.projectId },
        transaction: transaction,
      });

      await this.expertTranslationRepository.update(expertDto, {
        returning: undefined,
        transaction: transaction,
        where: {
          expert_id: id,
          lang_id: expertDto.langId,
        },
      });
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw new HttpException('An error occurred.', HttpStatus.BAD_REQUEST);
    }
  }

  public async destroy(id: number): Promise<number> {
    await this.getOne({ id });

    return await this.expertRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }
}
