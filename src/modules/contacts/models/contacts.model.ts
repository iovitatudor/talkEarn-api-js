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

interface ContactCreationAttrs {
  project_id: number;
  name: string;
  icon: string;
}

@Table({
  tableName: 'contacts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Contact extends Model<Contact, ContactCreationAttrs> {
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

  @ApiProperty({ example: 'Facebook' })
  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @ApiProperty({ example: 'File' })
  @Column({ type: DataType.STRING, allowNull: true })
  public icon: string;

  @BelongsTo(() => Project)
  public project: Project;
}
