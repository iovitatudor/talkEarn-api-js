import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Service } from './models/services.model';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceUpdateDto } from './dto/service-update.dto';
import { ExpertsService } from '../experts/experts.service';
import { FilesService } from '../../common/files/files.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private serviceRepository: typeof Service,
    private expertService: ExpertsService,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Service[]> {
    return await this.serviceRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true },
    });
    if (!service) {
      throw new HttpException('Service was not found.', HttpStatus.BAD_REQUEST);
    }
    return service;
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);
    return await this.serviceRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(
    serviceDto: ServiceCreateDto,
    image: any,
  ): Promise<Service> {
    let fileName = null;
    if (image) {
      fileName = await this.fileService.createFile(image);
    }

    const service = await this.serviceRepository.create({
      ...serviceDto,
      image: fileName,
      project_id: Number(AuthGuard.projectId),
    });

    return await this.findById(service.id);
  }

  public async update(
    id: number,
    serviceDto: ServiceUpdateDto,
    image: any,
  ): Promise<Service> {
    let servicesData = { ...serviceDto };
    if (image) {
      const fileName = await this.fileService.createFile(image);
      servicesData = { ...serviceDto, image: fileName };
    }

    await this.serviceRepository.update(servicesData, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }

  public async findServicesByExpertId(expertId: number): Promise<Service[]> {
    const expert = await this.expertService.findById(expertId);
    if (!expert) {
      throw new HttpException('Expert is not found.', HttpStatus.BAD_REQUEST);
    }
    return await this.serviceRepository.findAll({
      order: [['id', 'DESC']],
      where: { expert_id: expertId, project_id: AuthGuard.projectId },
    });
  }
}
