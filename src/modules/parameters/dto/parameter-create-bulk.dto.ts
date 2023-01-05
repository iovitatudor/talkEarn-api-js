import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParameterCreateBulkDto {
  @IsNotEmpty()
  @ApiProperty({ example: '[1: "New York"]', description: 'Parameters' })
  parameters: Array<any>;
}
