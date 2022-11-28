import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParameterExpertCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'New York' })
  value: string;
}
