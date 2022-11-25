import { ApiProperty } from '@nestjs/swagger';

export class ContactUpdateDto {
  @ApiProperty({ example: 'Facebook', description: 'Contact name' })
  name: string;

  @ApiProperty({ example: 'File', description: 'contact icon' })
  icon: string;
}
