import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';

@Injectable()
export class ParametersResource {
  public id: number;
  public name: string;

  public constructor(parameter) {
    this.id = parameter.id;
    this.name = parameter.name;
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new ParametersResource(item);
    });
  }
}
