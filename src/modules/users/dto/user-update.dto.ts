import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', required: false })
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@email.com', required: false })
  public email: string;

  @ApiProperty({ example: '+37369012201', required: false })
  public phone: string;

  @ApiProperty({ example: 'password', required: false })
  public password: string;

  @ApiProperty({ example: '1', required: false })
  public expert_id: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public avatar: string;

  public project_id: number;

  public available: boolean;

  public duration: string;

  public path: string;

  public last_entry: Date;

  public cookie: string;
}