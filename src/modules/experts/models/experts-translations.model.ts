import {
  Table,
  BelongsTo,
  Column,
  ForeignKey,
  DataType,
  Model,
} from 'sequelize-typescript';
import { Expert } from './experts.model';
import { Language } from '../../languages/models/languages.model';

interface ExpertTranslationCreateAttrs {
  expert_id: number;
  lang_id: number;
  name: string;
  description: string;
  profession: string;
  region: string;
  language: string;
  experience: string;
  video: string;
}

@Table({
  tableName: 'experts-translations',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ExpertTranslation extends Model<
  ExpertTranslation,
  ExpertTranslationCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER })
  public lang_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public video: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public profession: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public region: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public language: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public experience: string;

  @BelongsTo(() => Expert, 'expert_id')
  public expert: Expert;

  @BelongsTo(() => Language, 'lang_id')
  public lang: Language;
}
