import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatusesEnum } from '../enums/notification-statuses.enum';
import { ExpertsResource } from '../../experts/resources/experts.resource';

export class SupervisorResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: {} })
  public supervisor: object;

  @ApiProperty({ example: {} })
  public supervisee: object;

  @ApiProperty({ example: 1 })
  public requestedId: number;

  @ApiProperty({ example: NotificationStatusesEnum.opened })
  public status: NotificationStatusesEnum;

  @ApiProperty({ example: 'somebody wants to add you as a supervisor' })
  public message: string;

  public constructor(notification) {
    if (notification) {
      this.id = notification.id;
      this.supervisor = new ExpertsResource(notification.supervisor);
      this.supervisee = new ExpertsResource(notification.supervisor);
      this.requestedId = notification.requested_id;
      this.message = notification.message;
    }
  }

  public static collect(model: Model[]): SupervisorResource[] {
    return model.map((item) => {
      return new SupervisorResource(item);
    });
  }
}
