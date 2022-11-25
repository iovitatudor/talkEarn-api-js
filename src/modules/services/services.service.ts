import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Service } from './models/services.model';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceUpdateDto } from './dto/service-update.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private serviceRepository: typeof Service,
  ) {}

  public async getAll() {
    return await this.serviceRepository.findAll({
      where: { project_id: AuthGuard.projectId },
    });
  }

  public async findById(id: number) {
    return await this.serviceRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async destroy(id: number) {
    return await this.serviceRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async store(serviceDto: ServiceCreateDto) {
    return this.serviceRepository.create({
      ...serviceDto,
      project_id: Number(AuthGuard.projectId),
      expert_id: Number(AuthGuard.expertId),
    });
  }

  public async update(id: number, serviceDto: ServiceUpdateDto) {
    await this.serviceRepository.update(serviceDto, {
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }
}
