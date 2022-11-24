import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @IsString()
  @ApiProperty({ example: 'Trading', description: 'Category name' })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'Category Description',
    description: 'Category description',
  })
  description: string;

  @IsString()
  @ApiProperty({ example: 'File', description: 'Category icon' })
  icon: string;
}