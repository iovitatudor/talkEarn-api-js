import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './models/categories.model';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  public async getAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll({
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

  public async destroy(id: number): Promise<number> {
    return await this.categoryRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async store(expertDto: CategoryCreateDto): Promise<Category> {
    const category = await this.categoryRepository.create({
      ...expertDto,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(category.id);
  }

  public async update(id: number, expertDto: CategoryUpdateDto): Promise<Category> {
    await this.categoryRepository.update(expertDto, {
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
