import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading', description: 'Service name' })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'Service Description',
    description: 'Service description',
  })
  description: string;

  @ApiProperty({ example: 'File', description: 'Service icon' })
  image: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '20', description: 'Service price' })
  price: number;
}
