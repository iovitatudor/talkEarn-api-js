import { ApiProperty } from '@nestjs/swagger';

export class ServiceUpdateDto {
  @ApiProperty({ example: 'Trading', description: 'Service name' })
  name: string;

  @ApiProperty({
    example: 'Service Description',
    description: 'Service description',
  })
  description: string;

  @ApiProperty({ example: 'File', description: 'Service icon' })
  image: string;

  @ApiProperty({ example: '20', description: 'Service price' })
  price: number;
}
