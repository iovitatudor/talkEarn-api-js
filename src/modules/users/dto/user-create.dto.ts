import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ example: 'John Doe', required: false })
  public name: string;

  @ApiProperty({ example: 'john@email.com', required: false })
  public email: string;

  @ApiProperty({ example: '+37369012201', required: false })
  public phone: string;

  @ApiProperty({ example: 'password', required: false })
  public password: string;

  public project_id: number;

  @ApiProperty({ example: '1', required: false })
  public expert_id: number;

  public available: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public avatar: string;

  public duration: string;

  public path: string;

  public last_entry: Date;

  public cookie: string;
}