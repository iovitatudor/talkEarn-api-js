import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
  Model,
} from 'sequelize-typescript';
import { Collection } from './collection.model';
import { Language } from '../../languages/models/languages.model';

interface CollectionTranslationCreateAttrs {
  collection_id: number;
  lang_id: number;
  name: string;
  description: string;
}

@Table({
  tableName: 'collections_translations',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CollectionTranslation extends Model<
  CollectionTranslation,
  CollectionTranslationCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Collection)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public collection_id: number;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public lang_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @BelongsTo(() => Collection, 'collection_id')
  public collection: Collection;

  @BelongsTo(() => Language, 'lang_id')
  public language: Language;
}
