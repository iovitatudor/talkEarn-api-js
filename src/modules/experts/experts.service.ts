import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Expert } from './models/experts.model';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertCreateExpressDto } from './dto/express-create-express.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import * as bcrypt from 'bcryptjs';
import { FilesService } from '../../common/files/files.service';
import { Op } from 'sequelize';
import { Category } from '../categories/models/categories.model';
import { Parameter } from '../parameters/models/parameters.model';
import { ParameterExpert } from '../parameters/models/parameter-expert.model';
import { CategoryTranslation } from '../categories/models/categories_translations.model';
import { GlobalData } from '../auth/guards/global-data';
import { ParameterExpertTranslation } from '../parameters/models/parameter-expert-translations.model';
import { ExpertTranslation } from './models/experts-translations.model';
import slug = require('slug');
import { Language } from '../languages/models/languages.model';

@Injectable()
export class ExpertsService {
  constructor(
    @InjectModel(Expert) private expertRepository: typeof Expert,
    @InjectModel(ExpertTranslation)
    private expertTranslationRepository: typeof ExpertTranslation,
    private fileService: FilesService,
  ) {}

  public async getAll(
    limit = 30,
    page = 1,
    active = null,
    available = null,
    recommended = null,
    category_id = null,
  ) {
    const where = { project_id: AuthGuard.projectId, type: 'Employee' };
    if (active) where['active'] = active;
    if (available) where['available'] = !!available;
    if (recommended) where['recommended'] = recommended;
    if (category_id) where['category_id'] = category_id;

    const totalItems = await this.expertRepository.count({
      where: { ...where },
    });

    const totalPages = totalItems / limit;
    let offset = 0;
    if (totalItems > page) {
      offset = Math.floor((totalItems / totalPages) * page - limit);
    }

    const data = await this.expertRepository.findAll({
      order: [['id', 'DESC']],
      where: { ...where },
      include: [
        {
          model: ExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Category,
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
      ],
      limit: 50,
      offset: 0,
    });

    return {
      data,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalPages),
      },
    };
  }

  public async findById(id: number): Promise<Expert> {
    const expert = await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: [
        {
          model: ExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Category,
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
      ],
    });

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }
    return expert;
  }

  public async findBySlug(slug: string): Promise<Expert> {
    const expert = await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { slug, project_id: AuthGuard.projectId },
      include: [
        {
          model: ExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Category,
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
      ],
    });
    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }
    return expert;
  }

  async store(expertDto: ExpertCreateDto, avatar: any): Promise<Expert> {
    await this.validateExpert(expertDto.email, 0);

    if (avatar) {
      expertDto.avatar = await this.fileService.createFile(avatar);
    }

    expertDto.password = await bcrypt.hash(expertDto.password, 5);
    expertDto.slug = slug(expertDto.name, { locale: 'en' });

    const expert = await this.expertRepository.create({
      ...expertDto,
      project_id: AuthGuard.projectId,
    });

    for (const language of GlobalData.languages) {
      await this.expertTranslationRepository.create({
        expert_id: expert.id,
        lang_id: language.id,
        ...expertDto,
      });
    }

    return await this.findById(expert.id);
  }

  public async update(
    id: number,
    expertDto: ExpertUpdateDto,
    avatar: any,
  ): Promise<Expert> {
    await this.validateExpert(expertDto.email, id);

    if (avatar) {
      expertDto.avatar = await this.fileService.createFile(avatar);
    }

    if (expertDto.password) {
      expertDto.password = await bcrypt.hash(expertDto.password, 5);
    }

    await this.expertRepository.update(expertDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });

    await this.expertTranslationRepository.update(expertDto, {
      returning: undefined,
      where: {
        expert_id: id,
        lang_id: expertDto.langId,
      },
    });

    return await this.findById(id);
  }

  public async saveVideo(
    id: number,
    video: any,
    langId: number,
  ): Promise<Expert> {
    await this.findById(id);
    if (video) {
      const fileName = await this.fileService.createFile(video);
      await this.expertTranslationRepository.update(
        { video: fileName },
        {
          returning: undefined,
          where: { expert_id: id, lang_id: langId },
        },
      );
    }
    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);

    return await this.expertRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async findByEmail(email: string): Promise<Expert> {
    return await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { email },
    });
  }

  async partialStore(expertDto: ExpertCreateExpressDto): Promise<Expert> {
    await this.validateExpert(expertDto.email, 0);

    expertDto.slug = slug(expertDto.name, { locale: 'en' });

    const expert = await this.expertRepository.create({ ...expertDto });

    for (const language of GlobalData.languages) {
      await this.expertTranslationRepository.create({
        expert_id: expert.id,
        lang_id: language.id,
        ...expertDto,
      });
    }

    return await this.findById(expert.id);
  }

  public async toggleStatus(expertId: number): Promise<Expert> {
    const expert = await this.findById(expertId);
    let available = true;
    if (expert.available) {
      available = false;
    }

    await this.expertRepository.update(
      { available },
      {
        returning: undefined,
        where: { id: expertId, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(expertId);
  }

  public async updateDeviceToken(
    expertId: number,
    deviceToken: string,
  ): Promise<Expert> {
    await this.findById(expertId);

    await this.expertRepository.update(
      { device_token: deviceToken },
      {
        returning: undefined,
        where: { id: expertId, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(expertId);
  }

  public async search(page = 1, search: '') {
    const where = {};
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { profession: { [Op.like]: `%${search}%` } },
    ];

    const findExperts = await this.expertTranslationRepository.findAll({
      attributes: ['expert_id'],
      where: { ...where },
      raw: true,
      include: [
        {
          model: Expert,
          where: { project_id: AuthGuard.projectId, type: 'Employee' },
        },
      ],
      limit: 20,
      offset: 0,
    });

    const expertIds = findExperts.map((expert) => {
      return expert.expert_id;
    });

    const data = await this.expertRepository.findAll({
      order: [['id', 'DESC']],
      where: {
        id: expertIds,
        project_id: AuthGuard.projectId,
        type: 'Employee',
      },
      include: [
        {
          model: ExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Category,
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
      ],
    });

    return {
      data,
      meta: null,
    };
  }

  private async validateExpert(expertEmail: string, id: number): Promise<void> {
    const expert = await this.findByEmail(expertEmail);
    if (expert && expert.id !== id) {
      throw new HttpException(
        'This email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async addNewTranslations(language: Language) {
    const expertTranslations = await this.expertTranslationRepository.findAll({
      where: { lang_id: GlobalData.langId },
    });

    for (const expertTranslation of expertTranslations) {
      await this.expertTranslationRepository.create({
        expert_id: expertTranslation.expert_id,
        lang_id: language.id,
        name: expertTranslation.name,
        description: expertTranslation.description,
        profession: expertTranslation.profession,
        region: expertTranslation.region,
        language: expertTranslation.language,
        experience: expertTranslation.experience,
        video: expertTranslation.video,
      });
    }
  }

  async deleteTranslations(language: Promise<Language>) {
    return await this.expertTranslationRepository.destroy({
      where: { lang_id: (await language).id },
    });
  }

  public async getSuperviseeByExpertId(expertId: number) {
    const where = {
      project_id: AuthGuard.projectId,
      type: 'Employee',
      supervisor_id: expertId,
    };

    return await this.expertRepository.findAll({
      order: [['id', 'DESC']],
      where: { ...where },
      include: [
        {
          model: ExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Category,
          include: [
            {
              model: CategoryTranslation,
              where: { lang_id: GlobalData.langId },
              required: false,
            },
          ],
        },
      ],
    });
  }

  public async getSupervisorsByExpertId(expertId: number) {
    const expert = await this.findById(expertId);

    const where = {
      project_id: AuthGuard.projectId,
      type: 'Employee',
      id: expert.supervisor_id,
    };

    return await this.expertRepository.findAll({
      order: [['id', 'DESC']],
      where: { ...where },
      include: [
        {
          model: ExpertTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Category,
          include: [
            {
              model: CategoryTranslation,
              where: { lang_id: GlobalData.langId },
              required: false,
            },
          ],
        },
      ],
    });
  }
}
