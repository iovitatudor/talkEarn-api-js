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

interface ServiceCreationAttrs {
  project_id: number;
  expert_id: number;
  name: string;
  description: string;
  image: Express.Multer.File;
  price: number;
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

  @ApiProperty({ example: 'Trading' })
  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @ApiProperty({ example: 'File' })
  @Column({ type: DataType.STRING, allowNull: true })
  public image: Express.Multer.File;

  @ApiProperty({ example: 'Short description' })
  @Column({ type: DataType.TEXT, allowNull: true })
  public description: string;

  @ApiProperty({ example: '20' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  public price: number;

  @BelongsTo(() => Project, { onDelete: 'cascade' })
  public project: Project;

  @BelongsTo(() => Expert, { onDelete: 'cascade' })
  public experts: Expert;
}
