import { Model } from 'sequelize';
import {CollectionsResource} from "../../collections/resources/collections.resource";
import {ExpertsResource} from "../../experts/resources/experts.resource";

export class ServiceResource {
  public id: number;
  public collectionId: number;
  public name: string;
  public description: string;
  public video: string;
  public price: number;
  public hash: string;
  public collection: object;
  public expert: object;

  public constructor(service) {
    if (service) {
      this.id = service.id;
      this.collectionId = service.collection_id;
      this.name = service.translation ? service.translation.name : '';
      this.description = service.translation
        ? service.translation.description
        : '';
      this.video = service.translation
        ? service.translation.video
          ? process.env.BASE_URL + service.video
          : null
        : '';
      this.price = service.price;
      this.hash = service.hash;
      if (service.collection) {
        this.collection = new CollectionsResource(service.collection);
      }
      if (service.expert) {
        this.expert = new ExpertsResource(service.expert);
      }
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
