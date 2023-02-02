import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParameterExpertCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  langId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'New York' })
  value: string;
}
