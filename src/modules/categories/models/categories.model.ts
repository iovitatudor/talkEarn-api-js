import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';

interface CategoryCreateAttrs {
  name: string;
  description: string;
  icon: string;
}

@Table({ tableName: 'categories' })
export class Category extends Model<Category, CategoryCreateAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  icon: string;

  @HasMany(() => Expert)
  experts: Expert[];
}
