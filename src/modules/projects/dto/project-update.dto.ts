import { ModeTypes } from '../enums/mode-types.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProjectUpdateDto {
  @IsString()
  @ApiProperty({ example: 'talkEarn', description: 'Project Name' })
  public readonly name: string;

  @IsString()
  @ApiProperty({ example: 'https://talkearn.com', description: 'Project Url' })
  public readonly url: string;

  @IsString()
  @ApiProperty({ example: 'Development', description: 'Project Mode' })
  public readonly mode: ModeTypes;
}
