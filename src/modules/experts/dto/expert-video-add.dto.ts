import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExpertVideoAddDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  public langId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public video: string;
}
