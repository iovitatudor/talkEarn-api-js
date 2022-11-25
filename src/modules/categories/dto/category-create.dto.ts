import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Trading', description: 'Category name' })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'Category Description',
    description: 'Category description',
  })
  description: string;

  @ApiProperty({ example: 'File', description: 'Category icon' })
  icon: string;
}
