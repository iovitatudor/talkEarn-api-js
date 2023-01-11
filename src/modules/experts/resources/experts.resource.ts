import {Model} from 'sequelize';
import {CategoriesResource} from '../../categories/resources/categories.resource';
import {ExpertParametersResource} from "../../parameters/resources/expert-parameters.resource";
import {ServiceResource} from "../../services/resources/services.resource";
import {ParametersValueResource} from "../../parameters/resources/parameter-value.resource";

export class ExpertsResource {
  public id: number;
  public categoryId: number;
  public name: string;
  public slug: string;
  public email: string;
  public active: boolean;
  public available: boolean;
  public avatar: string;
  public video: string;
  public profession: string;
  public price: string;
  public type: string;
  public category: object;
  public parameters: object;
  public services: Array<any>;

  public constructor(expert) {
    this.id = expert.id;
    this.categoryId = expert.category_id;
    this.name = expert.name;
    this.slug = expert.slug;
    this.email = expert.email;
    this.active = expert.active;
    this.available = expert.available;
    this.avatar = expert.avatar;
    this.video = expert.video;
    this.profession = expert.profession;
    this.price = expert.price;
    this.type = expert.type;
    this.category = new CategoriesResource(expert.category);
    this.parameters = ParametersValueResource.collect(expert.parameters);
    this.services = ServiceResource.collect(expert.services);
  }

  public static collect(model: Model[], meta: Record<any, any>) {
    if (model) {
      const data = {};
      data['data'] = model.map((item) => {
        return new ExpertsResource(item);
      });
      if (meta) {
        data['meta'] = meta;
      }
      return data;
    }
  }
}
