import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
  Model,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { Project } from '../../projects/models/projects.model';
import { OrderTypesEnum } from '../enums/order-types.enum';
import { User } from '../../users/models/user.model';
import { Appointment } from '../../schedule/models/appointments.model';
import {OrderStatusesEnum} from "../enums/order-statuses.enum";

interface OrderCreateAttrs {
  project_id: number;
  user_id: number;
  expert_id: number;
  appointment_id: number;
  token: string;
  date: string;
  time: string;
  duration: string;
  amount: string;
  type: OrderTypesEnum;
}

@Table({
  tableName: 'orders',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Order extends Model<Order, OrderCreateAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public user_id: number;

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public appointment_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  token: string;

  @Column({ type: DataType.STRING, allowNull: false })
  date: string;

  @Column({ type: DataType.STRING, allowNull: false })
  time: string;

  @Column({ type: DataType.STRING, allowNull: false })
  duration: string;

  @Column({ type: DataType.STRING, allowNull: false })
  amount: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderTypesEnum)),
    allowNull: false,
    defaultValue: OrderTypesEnum.Call,
  })
  public type: OrderTypesEnum;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatusesEnum)),
    allowNull: false,
    defaultValue: OrderStatusesEnum.Pending,
  })
  public status: OrderStatusesEnum;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;

  @BelongsTo(() => User, 'user_id')
  public user: User;

  @BelongsTo(() => Expert, 'expert_id')
  public expert: Expert;

  @BelongsTo(() => Appointment, 'appointment_id')
  public appointment: Appointment;
}
