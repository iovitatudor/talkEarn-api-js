import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class CategoriesResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 'Trading' })
  public name: string;

  @ApiProperty({ example: 'Category Slug' })
  public slug: string;

  @ApiProperty({ example: 'Short Description of Trading' })
  public description: string;

  @ApiProperty({ example: 'File' })
  public icon: string;

  public constructor(category) {
    if (category) {
      this.id = category.id;
      this.name = category.name;
      this.slug = category.slug;
      this.description = category.description;
      this.icon = category.icon ? process.env.BASE_URL + category.icon : null;
    }
  }

  public static collect(model: Model[]): CategoriesResource[] {
    return model.map((item) => {
      return new CategoriesResource(item);
    });
  }
}
