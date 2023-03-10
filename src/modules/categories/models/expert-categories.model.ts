import {
  Column,
  ForeignKey,
  Table,
  DataType,
  Model,
  HasOne, BelongsTo,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { Category } from './categories.model';

interface ExpertCategoryCreateAttrs {
  category_id: number;
  expert_id: number;
}

@Table({
  tableName: 'expert_categories',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ExpertCategory extends Model<
  ExpertCategory,
  ExpertCategoryCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public category_id: number;

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsTo(() => Expert)
  expert: Expert;
}
