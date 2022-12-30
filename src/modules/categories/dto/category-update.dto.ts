import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @IsString()
  @ApiProperty({ example: 'Trading', required: false })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Category Description', required: false })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: string;
}
