import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from '../enums/types.enum';

export class ExpertUpdateDto {
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Expert name' })
  public name: string;

  @IsEmail()
  @ApiProperty({ example: 'john@email.com', description: 'Expert email' })
  public email: string;

  @ApiProperty({ example: 'password', description: 'Expert access password' })
  public password: string;

  public project_id: number;

  @ApiProperty({ example: '1', description: 'Category Id' })
  public category_id: number;

  @ApiProperty({ example: '1', description: 'Is active' })
  public active: boolean;

  public available: boolean;

  @ApiProperty({ example: '1', description: 'File' })
  public avatar: string;

  @ApiProperty({ example: 'Trader', description: 'Expert profession' })
  public profession: string;

  @ApiProperty({ example: '20', description: 'Price per minut' })
  public price: number;

  public type: Types;
}