import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatusesEnum } from '../enums/notification-statuses.enum';

export class SupervisorNotificationUpdateDto {
  @ApiProperty({ example: 1 })
  public supervisorId: number;

  @ApiProperty({ example: 2 })
  public superviseeId: number;

  @ApiProperty({ example: 1 })
  public requestedId: number;

  @ApiProperty({ example: NotificationStatusesEnum.opened })
  public status: NotificationStatusesEnum;

  @ApiProperty({ example: 'somebody wants to add you as a supervisor...' })
  public message: string;
}
