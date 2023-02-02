import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { ParameterExpert } from './parameter-expert.model';
import { Language } from '../../languages/models/languages.model';

interface ParameterExpertTranslationCreationAttrs {
  parameter_expert_id: number;
  lang_id: number;
  value: string;
}

@Table({
  tableName: 'parameter-expert-translations',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ParameterExpertTranslation extends Model<
  ParameterExpertTranslation,
  ParameterExpertTranslationCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => ParameterExpert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public parameter_expert_id: number;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public lang_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public value: string;

  @BelongsTo(() => Language)
  public language: Language;

  @BelongsTo(() => ParameterExpert)
  public parameterExpert: ParameterExpert;
}
