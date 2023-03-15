import { Model } from 'sequelize';
import { CategoriesResource } from '../../categories/resources/categories.resource';
import { ServiceResource } from '../../services/resources/services.resource';
import { ParametersValueResource } from '../../parameters/resources/parameter-value.resource';
import {ExpertCategoriesResource} from "../../categories/resources/expert-categories.resource";

export class ExpertsResource {
  public id: number;
  public categoryId: number;
  public categories: Array<any>;
  public supervisorId: number;
  public name: string;
  public description: string;
  public slug: string;
  public email: string;
  public active: boolean;
  public recommended: boolean;
  public show: boolean;
  public available: boolean;
  public avatar: string;
  public video: string;
  public profession: string;
  public region: string;
  public language: string;
  public experience: string;
  public rating: string;
  public price: string;
  public type: string;
  public deviceToken: string;
  public category: object;
  public parameters: object;
  public services: Array<any>;
  public createdAt: string;
  public updatedAt: string;

  public constructor(expert) {
    if (expert) {
      const date = new Date(expert.created_at);
      const updateDate = new Date(expert.updated_at);

      this.id = expert.id;
      this.categoryId = expert.category_id;
      this.categories = ExpertCategoriesResource.collect(expert.categories);
      this.supervisorId = expert.supervisor_id;
      this.name = expert.translation ? expert.translation.name : '';
      this.description = expert.translation
        ? expert.translation.description
        : '';
      this.slug = expert.slug;
      this.email = expert.email;
      this.recommended = expert.recommended;
      this.active = expert.active;
      this.show = expert.translation ? expert.translation.show : false;
      this.available = expert.available;
      this.avatar = expert.avatar ? process.env.BASE_URL + expert.avatar : null;
      this.video = expert.translation
        ? expert.translation.video
          ? process.env.BASE_URL + expert.translation.video
          : null
        : null;
      this.profession = expert.translation ? expert.translation.profession : '';
      this.region = expert.translation ? expert.translation.region : '';
      this.language = expert.translation ? expert.translation.language : '';
      this.experience = expert.translation ? expert.translation.experience : '';
      this.rating = expert.rating;
      this.price = expert.price;
      this.type = expert.type;
      this.deviceToken = expert.device_token;
      if (expert.category) {
        this.category = new CategoriesResource(expert.category);
      }
      if (expert.parameters) {
        this.parameters = ParametersValueResource.collect(expert.parameters);
      }
      if (expert.services) {
        this.services = ServiceResource.collect(expert.services);
      }
      this.createdAt = date.toDateString();
      this.updatedAt = updateDate.toDateString();
    }
  }

  public static collect(model: Model[], meta?: Record<any, any>) {
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
