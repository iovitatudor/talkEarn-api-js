import { ModeTypes } from '../enums/mode-types.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'talkEarn', description: 'Project Name' })
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://talkearn.com', description: 'Project Url' })
  public readonly url: string;

  @ApiProperty({ example: 'Development', description: 'Project Mode' })
  public readonly mode: ModeTypes;
}