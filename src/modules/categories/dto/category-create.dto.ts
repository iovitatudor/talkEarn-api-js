import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  public langId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading' })
  public name: string;

  public slug: string;

  @IsString()
  @ApiProperty({ example: 'Category Description', required: false })
  public description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: string;
}
