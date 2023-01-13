import { Model } from 'sequelize';
import { ExpertsResource } from '../../experts/resources/experts.resource';
import { ProjectsResource } from '../../projects/resources/projects.resource';

export class AuthResource {
  public token: string;
  public expert: ExpertsResource;
  public project: ProjectsResource;

  public constructor(data) {
    this.token = data.token;
    this.expert = new ExpertsResource(data.expert);
    this.project = new ProjectsResource(data.project);
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new AuthResource(item);
    });
  }
}
