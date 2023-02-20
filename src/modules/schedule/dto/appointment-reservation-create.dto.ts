import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentReservationCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  public appointmentId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', required: true })
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'johny@gmail.com', required: true })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '+3736043210', required: true })
  public phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'en', required: true })
  public language: string;
}