import {
  Model,
  BelongsTo,
  HasOne,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Project } from '../../projects/models/projects.model';
import { Expert } from '../../experts/models/experts.model';
import { Collection } from '../../collections/models/collection.model';
import { ServiceTranslation } from './services-translations.model';

interface ServiceCreationAttrs {
  project_id: number;
  expert_id: number;
  collection_id: number;
  price: number;
  hash: string;
}

@Table({
  tableName: 'services',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Service extends Model<Service, ServiceCreationAttrs> {
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

  @Column({ type: DataType.INTEGER, allowNull: true })
  public price: number;

  @Column({ type: DataType.STRING, allowNull: true })
  public hash: string;

  @HasOne(() => ServiceTranslation)
  public translation: ServiceTranslation;

  @BelongsTo(() => Project, { onDelete: 'cascade' })
  public project: Project;

  @BelongsTo(() => Collection, { onDelete: 'cascade' })
  public collection: Collection;

  @BelongsTo(() => Expert, { onDelete: 'cascade' })
  public expert: Expert;
}
