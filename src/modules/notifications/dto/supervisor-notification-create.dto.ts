import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatusesEnum } from '../enums/notification-statuses.enum';

export class SupervisorNotificationCreateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  public supervisorId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  public superviseeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  public requestedId: number;

  @ApiProperty({ example: NotificationStatusesEnum.opened })
  public status: NotificationStatusesEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'somebody wants to add you as a supervisor...' })
  public message: string;
}
