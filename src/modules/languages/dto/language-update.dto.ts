import { ApiProperty } from '@nestjs/swagger';

export class LanguageUpdateDto {
  @ApiProperty({ example: 'English', required: false })
  name: string;

  @ApiProperty({ example: 'en', required: false })
  abbr: string;

  @ApiProperty({ example: true, required: false })
  default: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: string;
}
