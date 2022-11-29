import { Model } from 'sequelize';
import { ExpertsResource } from '../../experts/resources/experts.resource';

export class AuthResource {
  public token: string;
  public expert: ExpertsResource;

  public constructor(data) {
    this.token = data.token;
    this.expert = new ExpertsResource(data.expert);
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new AuthResource(item);
    });
  }
}
