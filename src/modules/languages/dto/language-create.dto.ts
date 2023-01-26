import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LanguageCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'English' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'en' })
  public abbr: string;

  @IsString()
  @ApiProperty({ example: true, required: false })
  public default: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: string;
}
