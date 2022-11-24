import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@email.com', description: 'Expert email' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password', description: 'Expert access password' })
  public password: string;
}
