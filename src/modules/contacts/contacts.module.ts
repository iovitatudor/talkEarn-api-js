import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contact } from './models/contacts.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ContactsService],
  controllers: [ContactsController],
  imports: [SequelizeModule.forFeature([Contact]), AuthModule],
})
export class ContactsModule {}
