import {
  Controller,
  Body,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ContactsService } from './contacts.service';
import { ContactUpdateDto } from './dto/contact-update.dto';
import { ContactCreateDto } from './dto/contact-create.dto';
import {ContactExpertCreateDto} from "./dto/contact-expert-create.dto";

@ApiTags('Contacts')
@Controller('api')
export class ContactsController {
  public constructor(private contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Get all contacts per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('contacts')
  public getAll() {
    return this.contactsService.getAll();
  }

  @ApiOperation({ summary: 'Get contact by Id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Get('contact/:id')
  public getById(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findById(id);
  }

  @ApiOperation({ summary: 'Create contact' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Post('contact')
  public create(@Body() contactDto: ContactCreateDto) {
    return this.contactsService.store(contactDto);
  }

  @ApiOperation({ summary: 'Update contact' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Patch('contact/:id')
  public edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() contactDto: ContactUpdateDto,
  ) {
    return this.contactsService.update(id, contactDto);
  }

  @ApiOperation({ summary: 'Delete contact' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Delete('contact/:id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.destroy(id);
  }

  @ApiOperation({ summary: 'Set contact value and assign to an expert' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @Delete('contact/:contactId/expert/:expertId')
  public setContactValue(
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('expertId', ParseIntPipe) expertId: number,
    @Body() contactExpertDto: ContactExpertCreateDto,
  ) {
    return this.contactsService.addContactValue(
      contactId,
      expertId,
      contactExpertDto,
    );
  }
}
