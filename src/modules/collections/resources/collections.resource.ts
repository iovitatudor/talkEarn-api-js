import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionsResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 'Trading' })
  public name: string;

  @ApiProperty({ example: 'Collection slug' })
  public slug: string;

  @ApiProperty({ example: 'Short Description of Trading' })
  public description: string;

  @ApiProperty({ example: 'File' })
  public image: string;

  public constructor(collection) {
    if (collection) {
      this.id = collection.id;
      this.name = collection.name;
      this.slug = collection.slug;
      this.description = collection.description;
      this.image = collection.image
        ? process.env.BASE_URL + collection.image
        : null;
    }
  }

  public static collect(model: Model[]): CollectionsResource[] {
    return model.map((item) => {
      return new CollectionsResource(item);
    });
  }
}
