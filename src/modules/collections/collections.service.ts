import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection } from './models/collection.model';
import { CollectionUpdateDto } from './dto/collection-update.dto';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from '../../common/files/files.service';
import { Service } from '../services/models/services.model';
import { Expert } from '../experts/models/experts.model';
import { Category } from '../categories/models/categories.model';
import { CollectionTranslation } from './models/collection_translations.model';
import { GlobalData } from '../auth/guards/global-data';
import slug = require('slug');
import { Language } from '../languages/models/languages.model';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private collectionRepository: typeof Collection,
    @InjectModel(CollectionTranslation)
    private collectionTranslationRepository: typeof CollectionTranslation,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Collection[]> {
    return await this.collectionRepository.findAll({
      order: [['id', 'DESC']],
      where: { project_id: AuthGuard.projectId },
      include: [
        {
          model: CollectionTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Service,
          include: [{ model: Expert, include: [{ model: Category }] }],
        },
      ],
    });
  }

  public async findById(id: number): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: [
        {
          model: CollectionTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Service,
          include: [{ model: Expert, include: [{ model: Category }] }],
        },
      ],
    });
    if (!collection) {
      throw new HttpException(
        'Collection was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return collection;
  }

  public async findBySlug(slug: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      rejectOnEmpty: undefined,
      where: { slug, project_id: AuthGuard.projectId },
      include: [
        {
          model: CollectionTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Service,
          include: [{ model: Expert, include: [{ model: Category }] }],
        },
      ],
    });
    if (!collection) {
      throw new HttpException(
        'Collection was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return collection;
  }

  public async store(
    collectionDto: CollectionCreateDto,
    image: any,
  ): Promise<Collection> {
    if (image) {
      collectionDto.image = await this.fileService.createFile(image);
    }
    collectionDto.slug = slug(collectionDto.name, { locale: 'en' });

    const collection = await this.collectionRepository.create({
      ...collectionDto,
      project_id: Number(AuthGuard.projectId),
    });

    for (const language of GlobalData.languages) {
      await this.collectionTranslationRepository.create({
        collection_id: collection.id,
        lang_id: language.id,
        ...collectionDto,
      });
    }

    return await this.findById(collection.id);
  }

  public async update(
    id: number,
    collectionDto: CollectionUpdateDto,
    icon: any,
  ): Promise<Collection> {
    if (icon) {
      collectionDto.image = await this.fileService.createFile(icon);
    }

    await this.collectionRepository.update(collectionDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });

    await this.collectionTranslationRepository.update(collectionDto, {
      returning: undefined,
      where: {
        collection_id: id,
        lang_id: collectionDto.langId,
      },
    });

    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    return await this.collectionRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async addNewTranslations(language: Language) {
    const collectionTranslations =
      await this.collectionTranslationRepository.findAll({
        where: { lang_id: GlobalData.langId },
      });

    for (const collectionTranslation of collectionTranslations) {
      await this.collectionTranslationRepository.create({
        collection_id: collectionTranslation.collection_id,
        lang_id: language.id,
        name: collectionTranslation.name,
        description: collectionTranslation.description,
      });
    }
  }

  async deleteTranslations(language: Promise<Language>) {
    return await this.collectionTranslationRepository.destroy({
      where: { lang_id: (await language).id },
    });
  }
}
