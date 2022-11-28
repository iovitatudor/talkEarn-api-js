import { Model } from 'sequelize';

export class CategoriesResource {
  public id: number;
  public name: string;
  public description: string;
  public icon: string;

  public constructor(category) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.icon = category.icon;
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new CategoriesResource(item);
    });
  }
}