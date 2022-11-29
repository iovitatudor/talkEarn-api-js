import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ParameterUpdateDto {
  @ApiProperty({ example: 'Region', description: 'Parameter name' })
  @IsString()
  name: string;
}
