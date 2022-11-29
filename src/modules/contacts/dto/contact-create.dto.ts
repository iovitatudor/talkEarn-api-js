import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Facebook' })
  public name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    example: 'File',
  })
  public icon: Express.Multer.File;
}
