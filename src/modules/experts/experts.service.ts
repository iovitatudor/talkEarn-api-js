import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Expert } from './models/experts.model';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertCreateExpressDto } from './dto/express-create-express.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import * as bcrypt from 'bcryptjs';
import { FilesService } from '../../common/files/files.service';

@Injectable()
export class ExpertsService {
  constructor(
    @InjectModel(Expert) private expertRepository: typeof Expert,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Expert[]> {
    return await this.expertRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: { all: true },
    });
  }

  public async findById(id: number): Promise<Expert> {
    const expert = await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true },
    });

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }
    return expert;
  }

  public async update(
    id: number,
    expertDto: ExpertUpdateDto,
    avatar: any,
  ): Promise<Expert> {
    await this.validateExpert(expertDto.email, id);

    let fileName = null;

    if (avatar) {
      fileName = await this.fileService.createFile(avatar);
    }

    await this.expertRepository.update(
      { ...expertDto, avatar: fileName },
      {
        returning: undefined,
        where: { id, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);
    return await this.expertRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async findByEmail(email: string): Promise<Expert> {
    return await this.expertRepository.findOne({ where: { email } });
  }

  async partialStore(expertDto: ExpertCreateExpressDto): Promise<Expert> {
    await this.validateExpert(expertDto.email, 0);

    return await this.expertRepository.create({ ...expertDto });
  }

  async store(expertDto: ExpertCreateDto, avatar: any): Promise<Expert> {
    await this.validateExpert(expertDto.email, 0);
    let fileName = null;

    if (avatar) {
      fileName = await this.fileService.createFile(avatar);
    }

    const hashPassword = await bcrypt.hash(expertDto.password, 5);

    const expert = await this.expertRepository.create({
      ...expertDto,
      avatar: fileName,
      password: hashPassword,
      project_id: AuthGuard.projectId,
    });
    return await this.findById(expert.id);
  }

  private async validateExpert(expertEmail: string, id: number): Promise<void> {
    const expert = await this.findByEmail(expertEmail);
    if (expert && expert.id !== id) {
      throw new HttpException(
        'This email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
