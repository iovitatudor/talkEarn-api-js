import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Language } from './models/languages.model';
import { LanguageUpdateDto } from './dto/language-update.dto';
import { LanguageCreateDto } from './dto/language-create.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from '../../common/files/files.service';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language) private LanguageRepository: typeof Language,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Language[]> {
    return await this.LanguageRepository.findAll({
      order: [['id', 'DESC']],
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(id: number): Promise<Language> {
    const Language = await this.LanguageRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!Language) {
      throw new HttpException(
        'Language was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return Language;
  }

  public async findByAbbr(abbr: string): Promise<Language> {
    const Language = await this.LanguageRepository.findOne({
      rejectOnEmpty: undefined,
      where: { abbr, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!Language) {
      throw new HttpException(
        'Language was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return Language;
  }

  public async destroy(id: number): Promise<number> {
    return await this.LanguageRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(
    languageDto: LanguageCreateDto,
    icon: any,
  ): Promise<Language> {
    if (icon) {
      languageDto.icon = await this.fileService.createFile(icon);
    }

    const Language = await this.LanguageRepository.create({
      ...languageDto,
      project_id: Number(AuthGuard.projectId),
    });
    return await this.findById(Language.id);
  }

  public async update(
    id: number,
    languageDto: LanguageUpdateDto,
    icon: any,
  ): Promise<Language> {
    if (icon) {
      languageDto.icon = await this.fileService.createFile(icon);
    }
    await this.LanguageRepository.update(languageDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
