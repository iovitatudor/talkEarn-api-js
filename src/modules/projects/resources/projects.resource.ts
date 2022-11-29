import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { ModeTypes } from '../enums/mode-types.enum';

@Injectable()
export class ProjectsResource {
  @ApiProperty({ example: 1 })
  public id: number;
  @ApiProperty({ example: 'talkEarn' })
  public name: string;
  @ApiProperty({ example: 'https://talkEarn.crypto' })
  public url: string;
  @ApiProperty({ example: ModeTypes.Development })
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
