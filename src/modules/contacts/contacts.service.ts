import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Contact } from './models/contacts.model';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactUpdateDto } from './dto/contact-update.dto';
import { ContactExpert } from './models/contact-expert.model';
import { ContactExpertCreateDto } from './dto/contact-expert-create.dto';
import { ExpertsService } from '../experts/experts.service';
import { FilesService } from '../../common/files/files.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact) private contactRepository: typeof Contact,
    @InjectModel(ContactExpert)
    private contactExpertRepository: typeof ContactExpert,
    private expertService: ExpertsService,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Contact[]> {
    return await this.contactRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(contactId: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: contactId, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!contact) {
      throw new HttpException('Contact was not found.', HttpStatus.BAD_REQUEST);
    }
    return contact;
  }

  public async destroy(id: number): Promise<number> {
    const contact = await this.findById(id);
    return await this.contactRepository.destroy({
      where: { id: contact.id, project_id: AuthGuard.projectId },
    });
  }

  async store(contactDto: ContactCreateDto, icon: any): Promise<Contact> {
    let fileName = null;
    if (icon) {
      fileName = await this.fileService.createFile(icon);
    }

    const contact = await this.contactRepository.create({
      ...contactDto,
      icon: fileName,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(contact.id);
  }

  public async update(
    id: number,
    contactDto: ContactUpdateDto,
    icon: any,
  ): Promise<Contact> {
    let fileName = null;
    if (icon) {
      fileName = await this.fileService.createFile(icon);
    }
    await this.contactRepository.update(
      { ...contactDto, icon: fileName },
      {
        returning: undefined,
        where: { id, project_id: AuthGuard.projectId }
      });
    return await this.findById(id);
  }

  public async addContactValue(
    contactId: number,
    expertId: number,
    contactExpertDto: ContactExpertCreateDto,
  ): Promise<ContactExpert> {
    const contact = await this.findById(contactId);
    const expert = await this.expertService.findById(expertId);
    const contactExpert = await this.findContactValueByExpertId(
      contact.id,
      expert.id,
    );

    if (!contactExpert) {
      return await this.contactExpertRepository.create({
        ...contactExpertDto,
        contact_id: contact.id,
        expert_id: expert.id,
      });
    }

    await this.contactExpertRepository.update(contactExpertDto, {
      returning: undefined,
      where: { id: contactExpert.id },
    });

    return await this.findContactValueByExpertId(contact.id, expert.id);
  }

  public async getContactsByExpertId(
    expertId: number,
  ): Promise<ContactExpert[]> {
    const expert = await this.expertService.findById(expertId);

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }

    return await this.contactExpertRepository.findAll({
      where: { expert_id: expertId },
      include: { all: true },
    });
  }

  private async findContactValueByExpertId(
    contactId: number,
    expertId: number,
  ): Promise<ContactExpert> {
    return await this.contactExpertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { contact_id: contactId, expert_id: expertId },
      include: { all: true },
    });
  }
}
