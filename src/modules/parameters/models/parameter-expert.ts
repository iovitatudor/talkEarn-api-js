import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Expert } from '../../experts/models/experts.model';
import { Parameter } from './parameters.model';

interface ParameterExpertCreationAttrs {
  parameter_id: number;
  expert_id: number;
  value: string;
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
  @ApiProperty({ example: 1 })
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

  @ApiProperty({ example: 'New York' })
  @Column({ type: DataType.STRING, allowNull: false })
  public value: string;

  @BelongsTo(() => Parameter)
  public parameter: Parameter;

  @BelongsTo(() => Expert)
  public expert: Expert;
}
