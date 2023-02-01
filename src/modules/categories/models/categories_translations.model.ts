import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
  Model,
} from 'sequelize-typescript';
import { Category } from './categories.model';
import { Language } from '../../languages/models/languages.model';

interface CategoryTranslationCreateAttrs {
  category_id: number;
  lang_id: number;
  name: string;
  description: string;
}

@Table({
  tableName: 'categories_translations',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CategoryTranslation extends Model<
  CategoryTranslation,
  CategoryTranslationCreateAttrs
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

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public lang_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @BelongsTo(() => Category, 'category_id')
  public category: Category;

  @BelongsTo(() => Language, 'lang_id')
  public language: Language;
}
