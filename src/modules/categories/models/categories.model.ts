import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { Project } from '../../projects/models/projects.model';

interface CategoryCreateAttrs {
  project_id: number;
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

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  icon: string;

  @HasMany(() => Expert)
  experts: Expert[];

  @BelongsTo(() => Project, 'project_id')
  public project: Project;
}
