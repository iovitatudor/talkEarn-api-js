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

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private collectionRepository: typeof Collection,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Collection[]> {
    return await this.collectionRepository.findAll({
      order: [['id', 'DESC']],
      where: { project_id: AuthGuard.projectId },
      include: [
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
      include: { all: true, nested: true },
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
      include: { all: true, nested: true },
    });
    if (!collection) {
      throw new HttpException(
        'Collection was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return collection;
  }

  public async destroy(id: number): Promise<number> {
    return await this.collectionRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(
    collectionDto: CollectionCreateDto,
    image: any,
  ): Promise<Collection> {
    let fileName = null;
    if (image) {
      fileName = await this.fileService.createFile(image);
    }
    const slug = this.createSlug(collectionDto.name);

    const collection = await this.collectionRepository.create({
      ...collectionDto,
      slug,
      image: fileName,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(collection.id);
  }

  public async update(
    id: number,
    collectionDto: CollectionUpdateDto,
    icon: any,
  ): Promise<Collection> {
    let data = { ...collectionDto };
    if (icon) {
      const fileName = await this.fileService.createFile(icon);
      data = { ...collectionDto, image: fileName };
    }

    const slug = this.createSlug(collectionDto.name);

    await this.collectionRepository.update(
      { ...data, slug },
      {
        returning: undefined,
        where: { id, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(id);
  }

  private createSlug(text: string) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }
}
