import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty({ example: 'John Doe', required: false })
  public name: string;

  @ApiProperty({ example: 'john@email.com', required: false })
  public email: string;

  @ApiProperty({ example: '+37369012201', required: false })
  public phone: string;

  @ApiProperty({ example: 'password', required: false })
  public password: string;

  public project_id: number;

  public cookie: string;
}