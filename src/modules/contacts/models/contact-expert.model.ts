import {
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Contact } from './contacts.model';
import { Expert } from '../../experts/models/experts.model';

interface ContactExpertCreationAttrs {
  contact_id: number;
  expert_id: number;
  link: string;
}

@Table({
  tableName: 'contact-expert',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ContactExpert extends Model<
  ContactExpert,
  ContactExpertCreationAttrs
> {
  @ApiProperty({ example: 1 })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Contact)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public contact_id: number;

  @ForeignKey(() => Expert)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public expert_id: number;

  @ApiProperty({ example: 'https://facebook/talkearn' })
  @Column({ type: DataType.STRING, allowNull: false })
  public link: string;

  @BelongsTo(() => Contact)
  public contact: Contact;

  @BelongsTo(() => Expert)
  public expert: Expert;
}
