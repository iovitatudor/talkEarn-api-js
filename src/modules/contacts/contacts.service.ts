import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Contact } from './models/contacts.model';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactUpdateDto } from './dto/contact-update.dto';
import { ContactExpert } from './models/contact-expert.model';
import { ContactExpertCreateDto } from './dto/contact-expert-create.dto';
import { ExpertsService } from '../experts/experts.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact) private contactRepository: typeof Contact,
    @InjectModel(ContactExpert)
    private contactExpertRepository: typeof ContactExpert,
    private expertService: ExpertsService,
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

  public async findContactValueByExpertId(contactId: number, expertId: number) {
    return await this.contactExpertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { contact_id: contactId, expert_id: expertId },
      include: { all: true },
    });
  }

  public async addContactValue(
    contactId: number,
    expertId: number,
    contactExpertDto: ContactExpertCreateDto,
  ) {
    const contact = await this.findById(contactId);

    if (!contact) {
      throw new HttpException('Contact was not found.', HttpStatus.BAD_REQUEST);
    }

    const expert = await this.expertService.findById(expertId);

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }

    const contactExpert = await this.findContactValueByExpertId(
      contactId,
      expertId,
    );

    if (!contactExpert) {
      return await this.contactExpertRepository.create({
        ...contactExpertDto,
        contact_id: contact.id,
        expert_id: expertId,
      });
    }

    await this.contactExpertRepository.update(contactExpertDto, {
      returning: undefined,
      where: { id: contactExpert.id },
    });

    return await this.findContactValueByExpertId(contact.id, expertId);
  }

  public async getContactsByExpertId(expertId: number) {
    const expert = await this.expertService.findById(expertId);

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }

    return await this.contactExpertRepository.findAll({
      where: { expert_id: expertId },
      include: { all: true },
    });
  }
}
