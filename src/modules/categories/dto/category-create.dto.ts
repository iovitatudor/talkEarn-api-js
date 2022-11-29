import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading' })
  public name: string;

  @IsString()
  @ApiProperty({ example: 'Category Description', required: false })
  public description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: Express.Multer.File;
}
