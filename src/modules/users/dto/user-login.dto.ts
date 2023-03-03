import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ example: 'john@email.com', required: false })
  public email: string;

  @ApiProperty({ example: 'password', required: false })
  public password: string;
}