import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: false})
  public expertId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 60, required: false })
  public duration: number;

  @IsNotEmpty()
  @ApiProperty({ example: 20, required: false })
  public breakConsultation: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12:00', required: false })
  public from: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '19:00', required: false })
  public to: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true, default: true })
  public autoGenerate: boolean;

  @ApiProperty({ example: '["1","3"]', required: false })
  @IsNotEmpty()
  weekDays: Array<number>;
}