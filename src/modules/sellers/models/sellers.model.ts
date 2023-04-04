import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { Project } from '../../projects/models/projects.model';

interface SellerCreationAttrs {
  expert_id: number;
  project_id: number;
  merchant_id: string;
  merchant_id_in_paypal: string;
  permissions_granted: string;
  consent_status: string;
  product_intent_id: string;
  is_email_confirmed: boolean;
  account_status: string;
}

@Table({
  tableName: 'sellers',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Seller extends Model<Seller, SellerCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  public merchant_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public merchant_id_in_paypal: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public permissions_granted: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public consent_status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public product_intent_id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  public is_email_confirmed: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  public account_status: string;

  @BelongsTo(() => Project, { onDelete: 'cascade' })
  public project: Project;

  @BelongsTo(() => Expert, { onDelete: 'cascade' })
  public expert: Expert;
}
