import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Language } from './models/languages.model';
import { LanguageUpdateDto } from './dto/language-update.dto';
import { LanguageCreateDto } from './dto/language-create.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from '../../common/files/files.service';
import { CategoriesService } from '../categories/categories.service';
import { CollectionsService } from '../collections/collections.service';
import { ServicesService } from '../services/services.service';
import { ParametersService } from '../parameters/parameters.service';
import { ExpertsService } from '../experts/experts.service';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language) private languageRepository: typeof Language,
    private fileService: FilesService,
    private categoryService: CategoriesService,
    private collectionService: CollectionsService,
    private serviceService: ServicesService,
    private parameterService: ParametersService,
    private expertService: ExpertsService,
  ) {}

  public async getAll(): Promise<Language[]> {
    return await this.languageRepository.findAll({
      order: [
        ['default', 'DESC'],
        ['id', 'ASC'],
      ],
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async getDefaultLanguage() {
    return await this.languageRepository.findOne({
      rejectOnEmpty: undefined,
      where: { default: true, project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(id: number): Promise<Language> {
    const language = await this.languageRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!language) {
      throw new HttpException(
        'Language was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return language;
  }

  public async findByAbbr(abbr: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      rejectOnEmpty: undefined,
      where: { abbr, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!language) {
      throw new HttpException(
        'Language was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return language;
  }

  public async destroy(id: number): Promise<number> {
    const language = this.findById(id);

    await this.serviceService.deleteTranslations(language);
    await this.parameterService.deleteTranslations(language);
    await this.expertService.deleteTranslations(language);
    await this.categoryService.deleteTranslations(language);
    await this.collectionService.deleteTranslations(language);

    return await this.languageRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(
    languageDto: LanguageCreateDto,
    icon: any,
  ): Promise<Language> {
    if (icon) {
      languageDto.icon = await this.fileService.createFile(icon);
    }

    const defaultLanguage = await this.getDefaultLanguage();
    if (!defaultLanguage) {
      languageDto.default = true;
    }

    const language = await this.languageRepository.create({
      ...languageDto,
      project_id: Number(AuthGuard.projectId),
    });

    await this.categoryService.addNewTranslations(language);
    await this.collectionService.addNewTranslations(language);
    await this.parameterService.addNewTranslations(language);
    await this.serviceService.addNewTranslations(language);
    await this.expertService.addNewTranslations(language);

    return await this.findById(language.id);
  }

  public async update(
    id: number,
    languageDto: LanguageUpdateDto,
    icon: any,
  ): Promise<Language> {
    if (icon) {
      languageDto.icon = await this.fileService.createFile(icon);
    }
    if (languageDto.default) {
      await this.languageRepository.update(
        { default: false },
        {
          returning: undefined,
          where: { default: true, project_id: AuthGuard.projectId },
        },
      );
    }

    await this.languageRepository.update(languageDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
