import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ContactUpdateDto {
  @IsString()
  @ApiProperty({ example: 'Facebook', required: false })
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: Express.Multer.File;
}
