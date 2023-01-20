import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading' })
  public name: string;

  @IsString()
  @ApiProperty({ example: 'Collection description', required: false })
  public description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public image: Express.Multer.File;
}
