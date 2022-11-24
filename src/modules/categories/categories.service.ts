import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Category } from './models/categories.model';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryCreateDto } from './dto/category-create.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  public async getAll() {
    return await this.categoryRepository.findAll();
  }

  public async findById(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  public async destroy(id: number) {
    return await this.categoryRepository.destroy({ where: { id } });
  }

  async store(expertDto: CategoryCreateDto) {
    return this.categoryRepository.create(expertDto);
  }

  public async update(id: number, expertDto: CategoryUpdateDto) {
    await this.categoryRepository.update(expertDto, {
      where: { id },
    });
    return await this.findById(id);
  }
}
