import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
  Model,
} from 'sequelize-typescript';
import { Project } from '../../projects/models/projects.model';

interface LanguageCreateabbrs {
  project_id: number;
  name: string;
  abbr: string;
  default: boolean;
  icon: string;
}

@Table({
  tableName: 'languages',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Language extends Model<Language, LanguageCreateabbrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  abbr: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: 0 })
  default: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'f1d677a1-5e86-4fb3-acf8-4cec05e7534d.jpeg',
  })
  icon: string;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;
}
