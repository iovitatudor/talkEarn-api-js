import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { OrderTypesEnum } from '../enums/order-types.enum';
import { ExpertsResource } from '../../experts/resources/experts.resource';
import { UsersResource } from '../../users/resources/users.resource';
import { AppointmentResource } from '../../schedule/resources/appointment.resource';
import {OrderStatusesEnum} from "../enums/order-statuses.enum";

export class OrdersResource {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: {} })
  public expert: object;

  @ApiProperty({ example: {} })
  public user: object;

  @ApiProperty({ example: {} })
  public appointment: object;

  @ApiProperty({ example: '20' })
  public amount: string;

  @ApiProperty({ example: '20.01.2023' })
  public date: string;

  @ApiProperty({ example: '10:00' })
  public time: string;

  @ApiProperty({ example: OrderTypesEnum.Call })
  public type: OrderTypesEnum;

  @ApiProperty({ example: '123mk312mk3n213n21@!LEL#LD' })
  public token: string;

  @ApiProperty({ example: OrderStatusesEnum.Pending })
  public status: OrderStatusesEnum;

  public constructor(order) {
    if (order) {
      this.id = order.id;
      this.expert = order.expert ? new ExpertsResource(order.expert) : null;
      this.user = order.user ? new UsersResource(order.user) : null;
      this.appointment = order.appointment
        ? new AppointmentResource(order.appointment)
        : null;
      this.amount = order.amount;
      this.date = order.date;
      this.time = order.time;
      this.token = order.token;
      this.type = order.type;
      this.status = order.status;
    }
  }

  public static collect(model: Model[]): OrdersResource[] {
    return model.map((item) => {
      return new OrdersResource(item);
    });
  }
}
