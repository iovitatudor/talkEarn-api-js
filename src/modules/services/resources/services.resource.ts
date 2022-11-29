import { Model } from 'sequelize';

export class ServiceResource {
  public id: number;
  public name: string;
  public description: string;
  public image: string;
  public price: number;

  public constructor(service) {
    this.id = service.id;
    this.name = service.name;
    this.description = service.description;
    this.image = service.image;
    this.price = service.price;
  }

  public static collect(model: Model[]): ServiceResource[] {
    return model.map((item) => {
      return new ServiceResource(item);
    });
  }
}
