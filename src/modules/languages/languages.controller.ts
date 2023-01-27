import {
  Controller,
  Body,
  Param,
  UseGuards,
  HttpCode,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { LanguagesResource } from './resources/languages.resource';
import { LanguageCreateDto } from './dto/language-create.dto';
import { LanguageUpdateDto } from './dto/language-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ClientGuard } from '../auth/guards/client.guard';

@ApiTags('Languages')
@Controller('api')
export class LanguagesController {
  public constructor(private languagesService: LanguagesService) {}

  @ApiOperation({ summary: 'Get all languages per project' })
  @ApiResponse({ status: 200, type: [LanguagesResource] })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('languages')
  public async getAll(): Promise<LanguagesResource[]> {
    const languages = await this.languagesService.getAll();
    return LanguagesResource.collect(languages);
  }

  @ApiOperation({ summary: 'Get default language' })
  @ApiResponse({ status: 200, type: LanguagesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('language/default')
  public async getDefault(): Promise<LanguagesResource> {
    const language = await this.languagesService.getDefaultLanguage();
    return new LanguagesResource(language);
  }

  @ApiOperation({ summary: 'Get language by Id' })
  @ApiResponse({ status: 200, type: LanguagesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('language/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LanguagesResource> {
    const language = await this.languagesService.findById(id);
    return new LanguagesResource(language);
  }

  @ApiOperation({ summary: 'Get language by abbreviation' })
  @ApiResponse({ status: 200, type: LanguagesResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard)
  @Get('language/attr/:abbr')
  public async getBySlug(
    @Param('abbr') abbr: string,
  ): Promise<LanguagesResource> {
    const language = await this.languagesService.findByAbbr(abbr);
    return new LanguagesResource(language);
  }

  @ApiOperation({ summary: 'Create language' })
  @ApiResponse({ status: 200, type: LanguagesResource })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @UseGuards(AuthGuard, AdministratorGuard)
  @Post('language')
  public async create(
    @Body() languageDto: LanguageCreateDto,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<LanguagesResource> {
    const language = await this.languagesService.store(languageDto, icon);
    return new LanguagesResource(language);
  }

  @ApiOperation({ summary: 'Update language' })
  @ApiResponse({ status: 201, type: LanguagesResource })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @UseGuards(AuthGuard, AdministratorGuard)
  @Patch('language/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() languageDto: LanguageUpdateDto,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<LanguagesResource> {
    const language = await this.languagesService.update(id, languageDto, icon);
    return new LanguagesResource(language);
  }

  @ApiOperation({ summary: 'Delete language' })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(204)
  @Delete('language/:id')
  public delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.languagesService.destroy(id);
  }
}
