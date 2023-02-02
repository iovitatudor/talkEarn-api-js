import { Model } from 'sequelize';

export class ExpertParametersResource {
  public id: number;
  public parameterId: number;
  public name: string;
  public value: string;

  public constructor(parameterValue) {
    if (parameterValue) {
      this.id = parameterValue.id;
      this.parameterId = parameterValue.parameter_id;
      this.name = parameterValue?.parameter?.name;
      this.value = parameterValue.translation
        ? parameterValue.translation.value
        : '';
    }
  }

  public static collect(model: Model[]): ExpertParametersResource[] {
    if (model) {
      return model.map((item) => {
        return new ExpertParametersResource(item);
      });
    }
    return [];
  }
}
