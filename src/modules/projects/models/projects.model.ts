import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Expert } from '../../experts/models/experts.model';
import { ModeTypes } from '../enums/mode-types.enum';

interface ProjectCreationAttrs {
  name: string;
  url: string;
  token: string;
  mode: ModeTypes;
}

@Table({
  tableName: 'projects',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Project extends Model<Project, ProjectCreationAttrs> {
  @ApiProperty({ example: 1 })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ApiProperty({ example: 'talkEarn' })
  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @ApiProperty({ example: 'https://talkearn.crypto' })
  @Column({ type: DataType.STRING, allowNull: false })
  public url: string;

  @ApiProperty({ example: ModeTypes.Development })
  @Column({
    type: DataType.ENUM(...Object.values(ModeTypes)),
    allowNull: false,
    defaultValue: ModeTypes.Development,
  })
  public mode: ModeTypes;

  // @ApiProperty({ isArray: true, type: Expert })
  @HasMany(() => Expert)
  public experts: Expert[];
}
