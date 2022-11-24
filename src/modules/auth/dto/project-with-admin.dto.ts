import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModeTypes } from '../../projects/enums/mode-types.enum';
import { ProjectAdministratorDto } from './project-administrator.dto';
import { Type } from 'class-transformer';

export class ProjectWithAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'talkEarn', description: 'Project Name' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://talkearn.com', description: 'Project Url' })
  public url: string;

  @IsString()
  @ApiProperty({ example: ModeTypes.Development, description: 'Project Mode' })
  public mode: ModeTypes;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectAdministratorDto)
  @ApiProperty({ isArray: false, type: ProjectAdministratorDto })
  public administrator: ProjectAdministratorDto;
}