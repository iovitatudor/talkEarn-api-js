import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParameterExpertUpdateDto {
  @IsString()
  @ApiProperty({ example: 'New York' })
  value: string;
}
