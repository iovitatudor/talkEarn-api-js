import { ApiProperty } from '@nestjs/swagger';
import { OrderTypesEnum } from '../enums/order-types.enum';
import { OrderStatusesEnum } from '../enums/order-statuses.enum';

export class OrderUpdateDto {
  @ApiProperty({ example: '1' })
  public user_id: number;

  @ApiProperty({ example: '1' })
  public expert_id: number;

  @ApiProperty({ example: '1' })
  public appointment_id: number;

  @ApiProperty({ example: OrderTypesEnum.Call })
  public type: OrderTypesEnum;

  @ApiProperty({ example: '20' })
  public amount: string;

  @ApiProperty({ example: '20.01.2023' })
  public date: string;

  @ApiProperty({ example: '20:00' })
  public time: string;

  @ApiProperty({ example: OrderStatusesEnum.Pending })
  public status: OrderStatusesEnum;
}
