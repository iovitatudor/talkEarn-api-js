import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Service Description', required: false })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public image: Express.Multer.File;

  @ApiProperty({ example: 20, required: false})
  price: number;
}
