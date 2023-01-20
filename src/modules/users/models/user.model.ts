import {
  Table,
  BelongsTo,
  Column,
  ForeignKey,
  DataType,
  Model,
  Sequelize,
} from 'sequelize-typescript';
import { Project } from '../../projects/models/projects.model';

interface UserCreateAttrs {
  project_id: number;
  expert_id: number;
  cookie: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
  available: boolean;
  // duration: string;
  // path: string;
  // last_entry: Date;
}

@Table({
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User, UserCreateAttrs> {
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

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  public expert_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public cookie: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'f1d677a1-5e86-4fb3-acf8-4cec05e7534d.jpeg',
  })
  public avatar: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: 0 })
  public available: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  public duration: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public path: string;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  public last_entry: Date;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;

  // @BelongsTo(() => Expert, 'expert_id')
  // public expert: Expert;
}
