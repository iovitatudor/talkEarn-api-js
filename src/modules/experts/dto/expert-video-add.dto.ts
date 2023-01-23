import { ApiProperty } from '@nestjs/swagger';

export class ExpertVideoAddDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public video: string;
}
