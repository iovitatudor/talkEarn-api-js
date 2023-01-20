import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/models/projects.model';
import { Expert } from '../../experts/models/experts.model';
import { Collection } from '../../collections/models/collection.model';

interface ServiceCreationAttrs {
  project_id: number;
  expert_id: number;
  collection_id: number;
  name: string;
  description: string;
  video: string;
  price: number;
  hash: string;
}

@Table({
  tableName: 'services',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Service extends Model<Service, ServiceCreationAttrs> {
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

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @ForeignKey(() => Collection)
  @Column({ type: DataType.INTEGER, allowNull: true })
  public collection_id: number;

  @ApiProperty({ example: 'Trading' })
  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @ApiProperty({ example: 'File' })
  @Column({ type: DataType.STRING, allowNull: true })
  public video: string;

  @ApiProperty({ example: 'Short description' })
  @Column({ type: DataType.TEXT, allowNull: true })
  public description: string;

  @ApiProperty({ example: '20' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  public price: number;

  @ApiProperty({ example: '20' })
  @Column({ type: DataType.STRING, allowNull: true })
  public hash: string;

  @BelongsTo(() => Project, { onDelete: 'cascade' })
  public project: Project;

  @BelongsTo(() => Collection, { onDelete: 'cascade' })
  public collection: Collection;

  @BelongsTo(() => Expert, { onDelete: 'cascade' })
  public expert: Expert;
}
