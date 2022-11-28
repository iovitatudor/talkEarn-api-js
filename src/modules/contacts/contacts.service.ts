import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Contact } from './models/contacts.model';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactUpdateDto } from './dto/contact-update.dto';
import { ContactExpert } from './models/contact-expert.model';
import { ContactExpertCreateDto } from './dto/contact-expert-create.dto';
import { Expert } from '../experts/models/experts.model';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Expert) private expertRepository: typeof Expert,
    @InjectModel(Contact) private contactRepository: typeof Contact,
    @InjectModel(ContactExpert)
    private contactExpertRepository: typeof ContactExpert,
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

  public async addContactValue(
    contactId: number,
    expertId: number,
    contactExpertDto: ContactExpertCreateDto,
  ) {
    const contact = await this.contactRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: contactId, project_id: AuthGuard.projectId },
    });

    if (!contact) {
      throw new HttpException('Contact was not found.', HttpStatus.BAD_REQUEST);
    }

    const expert = await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: expertId, project_id: AuthGuard.projectId },
    });

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }

    const contactExpert = this.contactExpertRepository.update(
      contactExpertDto,
      {
        returning: undefined,
        where: { contact_id: contact.id, expert_id: expertId },
    });

    if (!contactExpert) {
      return await this.contactExpertRepository.create({
        ...contactExpertDto,
        contact_id: contact.id,
        expert_id: expertId,
      });
    }
    return contactExpert;
  }
}
