import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType, HasOne,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { Parameter } from './parameters.model';
import { ParameterExpertTranslation } from './parameter-expert-translations.model';

interface ParameterExpertCreationAttrs {
  parameter_id: number;
  expert_id: number;
}

@Table({
  tableName: 'parameter-expert',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ParameterExpert extends Model<
  ParameterExpert,
  ParameterExpertCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Parameter)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public parameter_id: number;

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @BelongsTo(() => Parameter)
  public parameter: Parameter;

  @BelongsTo(() => Expert)
  public expert: Expert;

  @HasOne(() => ParameterExpertTranslation)
  translation: ParameterExpertTranslation;
}
