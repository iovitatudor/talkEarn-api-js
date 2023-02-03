import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Service } from './services.model';
import { Language } from '../../languages/models/languages.model';

interface ServiceTranslationCreationAttrs {
  service_id: number;
  lang_id: number;
  name: string;
  description: string;
  video: string;
}

@Table({
  tableName: 'services_translations',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ServiceTranslation extends Model<
  ServiceTranslation,
  ServiceTranslationCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public service_id: number;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public lang_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public video: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public description: string;

  @BelongsTo(() => Service, { onDelete: 'cascade' })
  public service: Service;

  @BelongsTo(() => Language, { onDelete: 'cascade' })
  public language: Language;
}
