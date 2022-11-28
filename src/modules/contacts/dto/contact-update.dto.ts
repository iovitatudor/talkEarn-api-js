import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ContactUpdateDto {
  @IsString()
  @ApiProperty({ example: 'Facebook', description: 'Contact name' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'File', description: 'contact icon' })
  icon: string;
}
