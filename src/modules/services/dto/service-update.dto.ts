import { ApiProperty } from '@nestjs/swagger';

export class ServiceUpdateDto {
  @ApiProperty({ example: 'Trading', required: false })
  name: string;

  @ApiProperty({ example: 'Service Description', required: false })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public image: string;

  @ApiProperty({ example: '20', required: false })
  price: number;
}
