import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAssigmentDto {
  @IsNotEmpty()
  @ApiProperty({ example: '5', description: 'Expert ID', required: true })
  public userId: number;

  @IsNotEmpty()
  @ApiProperty({ example: '5', description: 'Expert ID', required: true })
  public expertId: number;
}
