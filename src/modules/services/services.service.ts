import { InjectModel } from '@nestjs/sequelize';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Service } from './models/services.model';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceUpdateDto } from './dto/service-update.dto';
import {ExpertsService} from "../experts/experts.service";

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private serviceRepository: typeof Service,
    private expertService: ExpertsService,
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

  public async findServicesByExpertId(expertId: number) {
    const expert = await this.expertService.findById(expertId);
    if (!expert) {
      throw new HttpException('Expert is not found.', HttpStatus.BAD_REQUEST);
    }
    return await this.serviceRepository.findAll({
      where: { expert_id: expertId, project_id: AuthGuard.projectId },
    });
  }
}
