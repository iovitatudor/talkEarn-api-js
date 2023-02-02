import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  HasOne,
  Table,
  DataType,
  Model,
} from 'sequelize-typescript';
import { Project } from '../../projects/models/projects.model';
import { Service } from '../../services/models/services.model';
import { CollectionTranslation } from './collection_translations.model';

interface CollectionCreateAttrs {
  project_id: number;
  slug: string;
  image: string;
}

@Table({
  tableName: 'collections',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Collection extends Model<Collection, CollectionCreateAttrs> {
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
  image: string;

  @HasMany(() => Service)
  services: Service[];

  @HasOne(() => CollectionTranslation)
  translation: CollectionTranslation;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;
}
