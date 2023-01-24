import { Model } from 'sequelize';
import { CategoriesResource } from '../../categories/resources/categories.resource';
import { ServiceResource } from '../../services/resources/services.resource';
import { ParametersValueResource } from '../../parameters/resources/parameter-value.resource';

export class ExpertsResource {
  public id: number;
  public categoryId: number;
  public name: string;
  public description: string;
  public slug: string;
  public email: string;
  public active: boolean;
  public recommended: boolean;
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
      this.name = expert.name;
      this.description = expert.description;
      this.slug = expert.slug;
      this.email = expert.email;
      this.recommended = expert.recommended;
      this.active = expert.active;
      this.available = expert.available;
      this.avatar = expert.avatar ? process.env.BASE_URL + expert.avatar : null;
      this.video = expert.video ? process.env.BASE_URL + expert.video : null;
      this.profession = expert.profession;
      this.region = expert.region;
      this.language = expert.language;
      this.experience = expert.experience;
      this.rating = expert.rating;
      this.price = expert.price;
      this.type = expert.type;
      this.category = new CategoriesResource(expert.category);
      this.parameters = ParametersValueResource.collect(expert.parameters);
      this.services = ServiceResource.collect(expert.services);
      this.createdAt = date.toDateString();
      this.updatedAt = updateDate.toDateString();
    }
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
