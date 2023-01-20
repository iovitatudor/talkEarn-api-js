import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from '../enums/types.enum';

export class ExpertUpdateDto {
  @IsString()
  @ApiProperty({ example: 'John Doe', required: false })
  public name: string;

  @ApiProperty({ example: 'Description' })
  public description: string;

  @IsEmail()
  @ApiProperty({ example: 'john@email.com', required: false })
  public email: string;

  @ApiProperty({ example: 'password', required: false })
  public password: string;

  public project_id: number;

  @ApiProperty({ example: '1', required: false })
  public category_id: number;

  @ApiProperty({ example: '1', required: false })
  public active: boolean;

  @ApiProperty({ example: '1', required: false })
  public recommended: boolean;

  public available: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public avatar: string;

  @ApiProperty({ example: 'Video Link', required: false })
  public video: string;

  @ApiProperty({ example: 'Trader', required: false })
  public profession: string;

  @ApiProperty({ example: 'London' })
  public region: string;

  @ApiProperty({ example: 'English', required: false })
  public language: string;

  @ApiProperty({ example: '10 years', required: false })
  public experience: string;

  @ApiProperty({ example: 5, required: false })
  public rating: number;

  @ApiProperty({ example: '20', required: false })
  public price: number;

  public type: Types;
}
