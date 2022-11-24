import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from '../enums/types.enum';

export class ExpertCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'Expert name' })
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@email.com', description: 'Expert email' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password', description: 'Expert access password' })
  public password: string;

  public project_id: number;

  public category_id: number;

  public active: boolean;

  public available: string;

  public avatar: string;

  public profession: string;

  public price: number;

  public type: Types;
}