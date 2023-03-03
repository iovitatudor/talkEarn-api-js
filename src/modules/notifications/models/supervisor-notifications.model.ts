import {
  Model,
  DataType,
  BelongsTo,
  Column,
  Table,
} from 'sequelize-typescript';
import { NotificationStatusesEnum } from '../enums/notification-statuses.enum';
import { Expert } from '../../experts/models/experts.model';

interface SupervisorNotificationsAttrs {
  supervisor_id: number;
  supervisee_id: number;
  requested_id: number;
  status: NotificationStatusesEnum;
  message: string;
}

@Table({
  tableName: 'supervisor_notifications',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class SupervisorNotifications extends Model<
  SupervisorNotifications,
  SupervisorNotificationsAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  supervisor_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  supervisee_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  requested_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationStatusesEnum)),
    allowNull: false,
    defaultValue: NotificationStatusesEnum.opened,
  })
  status: NotificationStatusesEnum;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @BelongsTo(() => Expert, 'supervisor_id')
  public supervisor: Expert;

  @BelongsTo(() => Expert, 'supervisee_id')
  public supervisee: Expert;

  @BelongsTo(() => Expert, 'requested_id')
  public requested: Expert;
}
