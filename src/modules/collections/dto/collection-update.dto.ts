import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionUpdateDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  public langId: number;

  @IsString()
  @ApiProperty({ example: 'Psychology', required: false })
  name: string;

  slug: string;

  @IsString()
  @ApiProperty({ example: 'Collection Description', required: false })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public image: string;
}
