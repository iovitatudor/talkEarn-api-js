import {
  Controller,
  Body,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe, HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { ContactsService } from './contacts.service';
import { ContactUpdateDto } from './dto/contact-update.dto';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactExpertCreateDto } from './dto/contact-expert-create.dto';
import { ExpertContactsResource } from './resources/expert-contacts.resource';
import { ContactsResource } from './resources/contacts.resource';

@ApiTags('Contacts')
@Controller('api')
export class ContactsController {
  public constructor(private contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Get all contacts per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('contacts')
  public async getAll() {
    const contacts = await this.contactsService.getAll();
    return ContactsResource.collect(contacts);
  }

  @ApiOperation({ summary: 'Get contact by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('contact/:id')
  public async getById(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findById(id);
    return new ContactsResource(contact);
  }

  @ApiOperation({ summary: 'Create contact' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('contact')
  public async create(@Body() contactDto: ContactCreateDto) {
    const contact = await this.contactsService.store(contactDto);
    return new ContactsResource(contact);
  }

  @ApiOperation({ summary: 'Update contact' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('contact/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() contactDto: ContactUpdateDto,
  ) {
    const contact = await this.contactsService.update(id, contactDto);
    return new ContactsResource(contact);
  }

  @ApiOperation({ summary: 'Delete contact' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(204)
  @Delete('contact/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.destroy(id);
  }

  @ApiOperation({ summary: 'Set contact value and assign to an expert' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('contact/:contactId/expert/:expertId')
  public async setContactValue(
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('expertId', ParseIntPipe) expertId: number,
    @Body() contactExpertDto: ContactExpertCreateDto,
  ) {
    const contact = await this.contactsService.addContactValue(
      contactId,
      expertId,
      contactExpertDto,
    );
    return new ExpertContactsResource(contact);
  }

  @ApiOperation({ summary: 'Get contacts by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('contacts/expert/:expertId')
  public async getExpertsParameters(
    @Param('expertId', ParseIntPipe) expertId: number,
  ) {
    const contacts = await this.contactsService.getContactsByExpertId(expertId);
    return ExpertContactsResource.collect(contacts);
  }
}
