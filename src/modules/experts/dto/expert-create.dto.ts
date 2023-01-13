import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from '../enums/types.enum';

export class ExpertCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'Expert name' })
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@email.com' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  public password: string;

  public project_id: number;

  @ApiProperty({ example: '1' })
  public category_id: number;

  @ApiProperty({ example: true, required: false })
  public active: boolean;

  @ApiProperty({ example: true, required: false })
  public recommended: boolean;

  public available: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public avatar: string;

  @ApiProperty({ example: 'Video Link', required: false })
  public video: string;

  @ApiProperty({ example: 'Developer', required: false })
  public profession: string;

  @ApiProperty({ example: 20, required: false })
  public price: number;

  public type: Types;
}