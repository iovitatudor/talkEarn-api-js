import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from '../enums/types.enum';

export class ExpertCreateExpressDto {
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

  public type: Types;
}