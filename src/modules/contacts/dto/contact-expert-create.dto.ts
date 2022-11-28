import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactExpertCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://facebook/talkearn',
    description: 'Contact value',
  })
  link: string;
}
