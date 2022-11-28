import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contact } from './models/contacts.model';
import { AuthModule } from '../auth/auth.module';
import { ContactExpert } from './models/contact-expert.model';
import { Expert } from '../experts/models/experts.model';
import { ExpertsModule } from '../experts/experts.module';

@Module({
  providers: [ContactsService],
  controllers: [ContactsController],
  imports: [
    SequelizeModule.forFeature([Contact, ContactExpert, Expert]),
    AuthModule,
    ExpertsModule,
  ],
})
export class ContactsModule {}
