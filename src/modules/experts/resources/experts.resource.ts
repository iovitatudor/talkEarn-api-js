import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';

@Injectable()
export class ExpertsResource {
  public id: number;
  public categoryId: number;
  public name: string;
  public email: string;
  public active: boolean;
  public available: boolean;
  public avatar: string;
  public profession: string;
  public price: string;

  public constructor(expert) {
    this.id = expert.id;
    this.categoryId = expert.category_id;
    this.name = expert.name;
    this.email = expert.email;
    this.active = expert.active;
    this.available = expert.available;
    this.avatar = expert.avatar;
    this.profession = expert.profession;
    this.price = expert.price;
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new ExpertsResource(item);
    });
  }
}
