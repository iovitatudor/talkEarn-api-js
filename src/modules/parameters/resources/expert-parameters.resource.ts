import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';

@Injectable()
export class ExpertParametersResource {
  public id: number;
  public parameterId: number;
  public name: string;
  public value: string;

  public constructor(parameterValue) {
    this.id = parameterValue.id;
    this.parameterId = parameterValue?.parameter.id;
    this.name = parameterValue?.parameter.name;
    this.value = parameterValue.value;
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new ExpertParametersResource(item);
    });
  }
}
