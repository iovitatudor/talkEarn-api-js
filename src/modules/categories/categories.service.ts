import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './models/categories.model';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from '../../common/files/files.service';
import { CategoryTranslation } from './models/categories_translations.model';
import { GlobalData } from '../auth/guards/global-data';
import slug = require('slug');
import {Language} from "../languages/models/languages.model";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    @InjectModel(CategoryTranslation)
    private categoryTranslationRepository: typeof CategoryTranslation,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll({
      order: [['id', 'DESC']],
      where: { project_id: AuthGuard.projectId },
      include: [
        {
          model: CategoryTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
  }

  public async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: [
        {
          model: CategoryTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
    if (!category) {
      throw new HttpException(
        'Category was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }

  public async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      rejectOnEmpty: undefined,
      where: { slug, project_id: AuthGuard.projectId },
      include: [
        {
          model: CategoryTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
    if (!category) {
      throw new HttpException(
        'Category was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }

  public async store(
    categoryDto: CategoryCreateDto,
    icon: any,
  ): Promise<Category> {
    if (icon) {
      categoryDto.icon = await this.fileService.createFile(icon);
    }
    categoryDto.slug = slug(categoryDto.name, { locale: 'en' });

    const category = await this.categoryRepository.create({
      ...categoryDto,
      project_id: Number(AuthGuard.projectId),
    });

    for (const language of GlobalData.languages) {
      await this.categoryTranslationRepository.create({
        category_id: category.id,
        lang_id: language.id,
        ...categoryDto,
      });
    }

    return await this.findById(category.id);
  }

  public async update(
    id: number,
    categoryDto: CategoryUpdateDto,
    icon: any,
  ): Promise<Category> {
    if (icon) {
      categoryDto.icon = await this.fileService.createFile(icon);
    }

    await this.categoryRepository.update(categoryDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });

    await this.categoryTranslationRepository.update(categoryDto, {
      returning: undefined,
      where: {
        category_id: id,
        lang_id: categoryDto.langId,
      },
    });

    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    return await this.categoryRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async addNewTranslations(language: Language) {
    const categoryTranslations =
      await this.categoryTranslationRepository.findAll({
        where: { lang_id: GlobalData.langId },
      });

    for (const categoryTranslation of categoryTranslations) {
      await this.categoryTranslationRepository.create({
        category_id: categoryTranslation.category_id,
        lang_id: language.id,
        name: categoryTranslation.name,
        description: categoryTranslation.description,
      });
    }
    return categoryTranslations;
  }

  async deleteTranslations(language: Promise<Language>) {
    return await this.categoryTranslationRepository.destroy({
      where: { lang_id: (await language).id },
    });
  }
}
