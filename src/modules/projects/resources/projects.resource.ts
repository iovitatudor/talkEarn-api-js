import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';

@Injectable()
export class ProjectsResource {
  public id: number;
  public name: string;
  public url: string;
  public mode: string;

  public constructor(project) {
    this.id = project.id;
    this.name = project.name;
    this.url = project.url;
    this.mode = project.mode;
  }

  public static collect(model: Model[]) {
    return model.map((item) => {
      return new ProjectsResource(item);
    });
  }
}
