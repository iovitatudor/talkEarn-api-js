import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  public langId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Psychology' })
  public name: string;

  public slug: string;

  @IsString()
  @ApiProperty({ example: 'Collection description', required: false })
  public description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public image: string;
}
