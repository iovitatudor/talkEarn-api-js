import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Contact } from './models/contacts.model';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactUpdateDto } from './dto/contact-update.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact) private contactRepository: typeof Contact,
  ) {}

  public async getAll() {
    return await this.contactRepository.findAll({
      where: { project_id: AuthGuard.projectId },
    });
  }

  public async findById(id: number) {
    return await this.contactRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async destroy(id: number) {
    return await this.contactRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async store(contactDto: ContactCreateDto) {
    return this.contactRepository.create({
      ...contactDto,
      project_id: Number(AuthGuard.projectId),
    });
  }

  public async update(id: number, contactDto: ContactUpdateDto) {
    await this.contactRepository.update(contactDto, {
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
