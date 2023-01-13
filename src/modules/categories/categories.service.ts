import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './models/categories.model';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from '../../common/files/files.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll({
      order: [['id', 'DESC']],
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true },
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
      include: { all: true },
    });
    if (!category) {
      throw new HttpException(
        'Category was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }

  public async destroy(id: number): Promise<number> {
    return await this.categoryRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(
    categoryDto: CategoryCreateDto,
    icon: any,
  ): Promise<Category> {
    let fileName = null;
    if (icon) {
      fileName = await this.fileService.createFile(icon);
    }
    const slug = this.createSlug(categoryDto.name);

    const category = await this.categoryRepository.create({
      ...categoryDto,
      slug,
      icon: fileName,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(category.id);
  }

  public async update(
    id: number,
    categoryDto: CategoryUpdateDto,
    icon: any,
  ): Promise<Category> {
    let data = { ...categoryDto };
    if (icon) {
      const fileName = await this.fileService.createFile(icon);
      data = { ...categoryDto, icon: fileName };
    }

    const slug = this.createSlug(categoryDto.name);

    await this.categoryRepository.update(
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
