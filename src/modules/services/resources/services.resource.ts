import { Model } from 'sequelize';
import {CollectionsResource} from "../../collections/resources/collections.resource";

export class ServiceResource {
  public id: number;
  public collectionId: number;
  public name: string;
  public description: string;
  public video: string;
  public price: number;
  public hash: string;
  public collection: object;

  public constructor(service) {
    if (service) {
      this.id = service.id;
      this.collectionId = service.collection_id;
      this.name = service.name;
      this.description = service.description;
      this.video = service.video ? process.env.BASE_URL + service.video : null;
      this.price = service.price;
      this.hash = service.hash;
      this.collection = new CollectionsResource(service.collection);
    }
  }

  public static collect(model: Model[]): ServiceResource[] {
    if (model) {
      return model.map((item) => {
        return new ServiceResource(item);
      });
    }
    return [];
  }
}
