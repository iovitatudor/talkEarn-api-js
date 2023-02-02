import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Project } from '../../projects/models/projects.model';

interface ParameterCreationAttrs {
  project_id: number;
  name: string;
}

@Table({
  tableName: 'parameters',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Parameter extends Model<Parameter, ParameterCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @BelongsTo(() => Project)
  public project: Project;
}
