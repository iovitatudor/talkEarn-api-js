import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionUpdateDto {
  @IsString()
  @ApiProperty({ example: 'Trading', required: false })
  name: string;

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
