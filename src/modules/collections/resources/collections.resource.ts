import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import {ServiceResource} from "../../services/resources/services.resource";

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

  @ApiProperty({ example: 'Services' })
  public services: Array<any>;

  public constructor(collection) {
    if (collection) {
      this.id = collection.id;
      this.name = collection.name;
      this.slug = collection.slug;
      this.description = collection.description;
      this.image = collection.image
        ? process.env.BASE_URL + collection.image
        : null;
      this.services = ServiceResource.collect(collection.services);
    }
  }

  public static collect(model: Model[]): CollectionsResource[] {
    return model.map((item) => {
      return new CollectionsResource(item);
    });
  }
}
