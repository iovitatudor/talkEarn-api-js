import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Expert } from './models/experts.model';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertCreateExpressDto } from './dto/express-create-express.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
export class ExpertsService {
  constructor(@InjectModel(Expert) private expertRepository: typeof Expert) {}

  public async getAll() {
    return await this.expertRepository.findAll({
      where: { project_id: AuthGuard.projectId },
    });
  }

  public async findById(id: number) {
    return await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async update(id: number, expertDto: ExpertUpdateDto) {
    await this.validateExpert(expertDto.email, id);
    await this.expertRepository.update(expertDto, {
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }

  public async destroy(id: number) {
    return await this.expertRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async findByEmail(email: string) {
    return await this.expertRepository.findOne({ where: { email } });
  }

  async partialStore(expertDto: ExpertCreateExpressDto) {
    return this.expertRepository.create({ ...expertDto });
  }

  async store(expertDto: ExpertCreateDto) {
    return this.expertRepository.create(expertDto);
  }

  private async validateExpert(expertEmail: string, id: number) {
    const expert = await this.findByEmail(expertEmail);
    if (expert && expert.id !== id) {
      throw new HttpException(
        'This email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
