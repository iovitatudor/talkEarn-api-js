import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class ExpertCategoriesResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 1 })
  public categoryId: number;

  @ApiProperty({ example: 1 })
  public expertId: number;

  public constructor(expertCategory) {
    if (expertCategory) {
      this.id = expertCategory.id;
      this.categoryId = expertCategory.category_id;
      this.expertId = expertCategory.expert_id;
    }
  }

  public static collect(model: Model[]): ExpertCategoriesResource[] {
    if (model) {
      return model.map((item) => {
        return new ExpertCategoriesResource(item);
      });
    }
  }
}
