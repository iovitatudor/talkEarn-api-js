import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class LanguagesResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 'English' })
  public name: string;

  @ApiProperty({ example: 'en' })
  public abbr: string;

  @ApiProperty({ example: false })
  public default: string;

  @ApiProperty({ example: 'File' })
  public icon: string;

  public constructor(language) {
    if (language) {
      this.id = language.id;
      this.name = language.name;
      this.abbr = language.abbr;
      this.default = language.default;
      this.icon = language.icon ? process.env.BASE_URL + language.icon : null;
    }
  }

  public static collect(model: Model[]): LanguagesResource[] {
    return model.map((item) => {
      return new LanguagesResource(item);
    });
  }
}
