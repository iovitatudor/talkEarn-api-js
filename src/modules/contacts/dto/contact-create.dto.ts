import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Facebook', description: 'Contact name' })
  name: string;

  @ApiProperty({ example: 'File', description: 'contact icon' })
  icon: string;
}
