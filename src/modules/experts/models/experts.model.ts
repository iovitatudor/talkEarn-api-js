import {
  Table,
  BelongsTo,
  Column,
  ForeignKey,
  DataType,
  Model,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/models/projects.model';
import { Category } from '../../categories/models/categories.model';
import { Types } from '../enums/types.enum';

interface ExpertCreateAttrs {
  project_id: number;
  category_id: number;
  name: string;
  email: string;
  profession: string;
  available: string;
  avatar: string;
  price: number;
  password: string;
  token: string;
}

@Table({
  tableName: 'experts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Expert extends Model<Expert, ExpertCreateAttrs> {
  @ApiProperty({ example: 1 })
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

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  public category_id: number;

  @ApiProperty({ example: 'John Doe' })
  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @ApiProperty({ example: 'john@email.com' })
  @Column({ type: DataType.STRING, allowNull: false })
  public email: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: 1 })
  public active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: 0 })
  public available: boolean;

  @ApiProperty({ example: 'File' })
  @Column({ type: DataType.STRING, allowNull: true })
  public avatar: string;

  @ApiProperty({ example: 'Trader' })
  @Column({ type: DataType.STRING, allowNull: true })
  public profession: string;

  @ApiProperty({ example: 20 })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 0 })
  public price: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Types)),
    allowNull: false,
    defaultValue: Types.Employee,
  })
  public type: Types;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;

  @BelongsTo(() => Category, 'category_id')
  public category: Category;
}
