import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GlobalData } from '../auth/guards/global-data';
import { Service } from './models/services.model';
import { ServiceTranslation } from './models/services-translations.model';
import { Collection } from '../collections/models/collection.model';
import { CollectionTranslation } from '../collections/models/collection_translations.model';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceUpdateDto } from './dto/service-update.dto';
import { ExpertsService } from '../experts/experts.service';
import { FilesService } from '../../common/files/files.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private serviceRepository: typeof Service,
    @InjectModel(ServiceTranslation)
    private serviceTranslationRepository: typeof ServiceTranslation,
    private expertService: ExpertsService,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Service[]> {
    return await this.serviceRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: [
        {
          model: Collection,
          include: [
            {
              model: CollectionTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
        {
          model: ServiceTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
  }

  public async findById(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: [
        {
          model: ServiceTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Collection,
          include: [
            {
              model: CollectionTranslation,
              where: { lang_id: GlobalData.langId },
              required: false,
            },
          ],
        },
      ],
    });
    if (!service) {
      throw new HttpException('Service was not found.', HttpStatus.BAD_REQUEST);
    }
    return service;
  }

  public async findByHash(hash: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      rejectOnEmpty: undefined,
      where: { hash, project_id: AuthGuard.projectId },
      include: [
        {
          model: Collection,
          include: [
            {
              model: CollectionTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
        {
          model: ServiceTranslation,
          where: { lang_id: GlobalData.langId },
        },
      ],
    });
    if (!service) {
      throw new HttpException('Service was not found.', HttpStatus.BAD_REQUEST);
    }
    return service;
  }

  public async store(
    serviceDto: ServiceCreateDto,
    video: any,
  ): Promise<Service> {
    if (video) {
      serviceDto.video = await this.fileService.createFile(video);
    }

    const service = await this.serviceRepository.create({
      ...serviceDto,
      project_id: Number(AuthGuard.projectId),
    });

    for (const language of GlobalData.languages) {
      await this.serviceTranslationRepository.create({
        ...serviceDto,
        service_id: service.id,
        lang_id: language.id,
      });
    }

    return await this.findById(service.id);
  }

  public async update(
    id: number,
    serviceDto: ServiceUpdateDto,
    video: any,
  ): Promise<Service> {
    if (video) {
      serviceDto.video = await this.fileService.createFile(video);
    }

    await this.serviceRepository.update(serviceDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });

    await this.serviceTranslationRepository.update(serviceDto, {
      returning: undefined,
      where: {
        service_id: id,
        lang_id: serviceDto.langId,
      },
    });

    console.log(GlobalData.langId);
    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);
    return await this.serviceRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async findServicesByExpertId(expertId: number): Promise<Service[]> {
    const expert = await this.expertService.findById(expertId);
    if (!expert) {
      throw new HttpException('Expert is not found.', HttpStatus.BAD_REQUEST);
    }
    return await this.serviceRepository.findAll({
      order: [['id', 'DESC']],
      where: { expert_id: expertId, project_id: AuthGuard.projectId },
      include: [
        {
          model: ServiceTranslation,
          where: { lang_id: GlobalData.langId },
        },
        {
          model: Collection,
          include: [
            {
              model: CollectionTranslation,
              where: { lang_id: GlobalData.langId },
              required: false,
            },
          ],
        },
      ],
    });
  }
}
