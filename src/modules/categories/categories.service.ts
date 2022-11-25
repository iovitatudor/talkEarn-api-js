import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Category } from './models/categories.model';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  public async getAll() {
    return await this.categoryRepository.findAll({
      where: { project_id: AuthGuard.projectId },
    });
  }

  public async findById(id: number) {
    return await this.categoryRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async destroy(id: number) {
    return await this.categoryRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async store(expertDto: CategoryCreateDto) {
    return this.categoryRepository.create({
      ...expertDto,
      project_id: Number(AuthGuard.projectId),
    });
  }

  public async update(id: number, expertDto: CategoryUpdateDto) {
    await this.categoryRepository.update(expertDto, {
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
