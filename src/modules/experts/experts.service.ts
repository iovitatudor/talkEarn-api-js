import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Expert } from './models/experts.model';
import { ExpertCreateDto } from './dto/expert-create.dto';
import { ExpertCreateExpressDto } from './dto/express-create-express.dto';
import { ExpertUpdateDto } from './dto/expert-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import * as bcrypt from 'bcryptjs';
import { FilesService } from '../../common/files/files.service';
import { Op } from 'sequelize';

@Injectable()
export class ExpertsService {
  constructor(
    @InjectModel(Expert) private expertRepository: typeof Expert,
    private fileService: FilesService,
  ) {}

  public async getAll(
    limit = 30,
    page = 1,
    active = null,
    online = null,
    recommended = null,
    category_id = null,
  ) {
    const where = { project_id: AuthGuard.projectId, type: 'Employee' };
    if (active) where['active'] = active;
    if (online) where['available'] = online;
    if (recommended) where['recommended'] = recommended;
    if (category_id) where['category_id'] = category_id;

    const totalItems = await this.expertRepository.count({
      where: { ...where },
    });

    const totalPages = totalItems / limit;
    let offset = 0;
    if (totalItems > page) {
      offset = Math.floor((totalItems / totalPages) * page - limit);
    }

    const data = await this.expertRepository.findAll({
      order: [['id', 'DESC']],
      where: { ...where },
      include: { all: true, nested: true },
      limit,
      offset,
    });

    return {
      data,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalPages),
      },
    };
  }

  public async findById(id: number): Promise<Expert> {
    const expert = await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true, nested: true },
    });

    if (!expert) {
      throw new HttpException('Expert was not found.', HttpStatus.BAD_REQUEST);
    }
    return expert;
  }

  public async findBySlug(slug: string): Promise<Expert> {
    const expert = await this.expertRepository.findOne({
      rejectOnEmpty: undefined,
      where: { slug, project_id: AuthGuard.projectId },
      include: { all: true, nested: true },
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
    let data = { ...expertDto };
    if (avatar) {
      const fileName = await this.fileService.createFile(avatar);
      data = { ...expertDto, avatar: fileName };
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 5);
    }

    const slug = this.createSlug(expertDto.name);

    await this.expertRepository.update(
      { ...data, slug },
      {
        returning: undefined,
        where: { id, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(id);
  }

  public async saveVideo(id: number, video: any): Promise<Expert> {
    await this.findById(id);
    if (video) {
      const fileName = await this.fileService.createFile(video);
      await this.expertRepository.update(
        { video: fileName },
        {
          returning: undefined,
          where: { id, project_id: AuthGuard.projectId },
        },
      );
    }
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
    const slug = this.createSlug(expertDto.name);

    return await this.expertRepository.create({ ...expertDto, slug });
  }

  async store(expertDto: ExpertCreateDto, avatar: any): Promise<Expert> {
    await this.validateExpert(expertDto.email, 0);
    let data = { ...expertDto };
    if (avatar) {
      const fileName = await this.fileService.createFile(avatar);
      data = { ...expertDto, avatar: fileName };
    }

    const hashPassword = await bcrypt.hash(expertDto.password, 5);
    const slug = this.createSlug(expertDto.name);

    const expert = await this.expertRepository.create({
      ...data,
      slug,
      password: hashPassword,
      project_id: AuthGuard.projectId,
    });
    return await this.findById(expert.id);
  }

  public async toggleStatus(expertId: number): Promise<Expert> {
    const expert = await this.findById(expertId);
    let available = true;
    if (expert.available) {
      available = false;
    }

    await this.expertRepository.update(
      { available },
      {
        returning: undefined,
        where: { id: expertId, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(expertId);
  }

  public async search(page = 1, search: '') {
    const where = { project_id: AuthGuard.projectId, type: 'Employee' };
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { profession: { [Op.like]: `%${search}%` } },
    ];
    const totalItems = await this.expertRepository.count({
      where: { ...where },
    });
    const totalPages = totalItems / 40;
    let offset = 0;
    if (totalItems > page)
      offset = Math.floor((totalItems / totalPages) * page - 40);

    const data = await this.expertRepository.findAll({
      order: [['id', 'DESC']],
      where: { ...where },
      include: { all: true, nested: true },
      limit: 40,
      offset,
    });

    return {
      data,
      meta: {
        itemsPerPage: 40,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalPages),
      },
    };
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

  private createSlug(text: string) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }
}
