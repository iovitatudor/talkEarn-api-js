import { ApiProperty } from '@nestjs/swagger';

export class ParameterUpdateDto {
  @ApiProperty({ example: 'Region', description: 'Parameter name' })
  name: string;
}
