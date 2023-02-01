import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
  DataType,
  Model,
  HasOne,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { Project } from '../../projects/models/projects.model';
import { CategoryTranslation } from './categories_translations.model';

interface CategoryCreateAttrs {
  project_id: number;
  slug: string;
  icon: string;
}

@Table({
  tableName: 'categories',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
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
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'f1d677a1-5e86-4fb3-acf8-4cec05e7534d.jpeg',
  })
  icon: string;

  @HasMany(() => Expert)
  experts: Expert[];

  @HasOne(() => CategoryTranslation)
  translation: CategoryTranslation;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;
}
