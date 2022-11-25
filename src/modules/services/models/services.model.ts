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
  image: string;
  price: number;
}

@Table({ tableName: 'services' })
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
  public image: string;

  @ApiProperty({ example: 'Short description' })
  @Column({ type: DataType.TEXT, allowNull: true })
  public description: string;

  @ApiProperty({ example: '20' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  public price: number;

  @BelongsTo(() => Project)
  public project: Project;

  @BelongsTo(() => Expert)
  public experts: Expert;
}
