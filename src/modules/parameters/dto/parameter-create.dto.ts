import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParameterCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Region', description: 'Parameter name' })
  name: string;
}
