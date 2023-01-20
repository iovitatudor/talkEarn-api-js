import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './models/user.model';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from '../../common/files/files.service';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import {UserAssigmentDto} from "./dto/user-assigment.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FilesService,
  ) {}

  public async getAll(limit = 30, page = 1, online = null, expert_id = null) {
    const where = { project_id: AuthGuard.projectId };
    if (online) where['available'] = online;
    if (expert_id) where['expert_id'] = expert_id;

    const totalItems = await this.userRepository.count({
      where: { ...where },
    });

    const totalPages = totalItems / limit;
    let offset = 0;
    if (totalItems > page) {
      offset = Math.floor((totalItems / totalPages) * page - limit);
    }

    const data = await this.userRepository.findAll({
      order: [['available', 'DESC']],
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

  public async findById(id: number): Promise<User> {
    const User = await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: { all: true, nested: true },
    });

    if (!User) {
      throw new HttpException('User was not found.', HttpStatus.BAD_REQUEST);
    }
    return User;
  }

  public async update(
    id: number,
    userDto: UserUpdateDto,
    avatar: any,
  ): Promise<User> {
    await this.validateUser(userDto.email, id);
    let data = { ...userDto };
    if (avatar) {
      const fileName = await this.fileService.createFile(avatar);
      data = { ...userDto, avatar: fileName };
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 5);
    }

    await this.userRepository.update(data, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);

    return await this.userRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async store(userDto: UserCreateDto, avatar: any): Promise<User> {
    if (userDto.email) {
      await this.validateUser(userDto.email, 0);
    }
    const checkUser = await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { cookie: userDto.cookie, project_id: AuthGuard.projectId },
    });

    userDto.last_entry = new Date();

    if (checkUser) {
      await this.userRepository.update(
        { ...userDto },
        {
          returning: undefined,
          where: { cookie: userDto.cookie, project_id: AuthGuard.projectId },
        },
      );
      return await this.findById(checkUser.id);
    }

    let data = { ...userDto };
    if (avatar) {
      const fileName = await this.fileService.createFile(avatar);
      data = { ...userDto, avatar: fileName };
    }

    if (userDto.password) {
      data.password = await bcrypt.hash(userDto.password, 5);
    }

    const User = await this.userRepository.create({
      ...data,
      project_id: AuthGuard.projectId,
    });
    return await this.findById(User.id);
  }

  public async toggleStatus(userId: number): Promise<User> {
    const user = await this.findById(userId);
    let available = true;
    if (user.available) {
      available = false;
    }

    await this.userRepository.update(
      { available },
      {
        returning: undefined,
        where: { id: userId, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(userId);
  }

  public async changeClientAssignment(
    userDto: UserAssigmentDto,
  ): Promise<User> {
    await this.findById(userDto.userId);
    await this.userRepository.update(
      { expert_id: userDto.expertId },
      {
        returning: undefined,
        where: { id: userDto.userId, project_id: AuthGuard.projectId },
      },
    );
    return await this.findById(userDto.userId);
  }

  public async search(page = 1, search: '') {
    const where = { project_id: AuthGuard.projectId };
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { profession: { [Op.like]: `%${search}%` } },
    ];
    const totalItems = await this.userRepository.count({
      where: { ...where },
    });
    const totalPages = totalItems / 40;
    let offset = 0;
    if (totalItems > page)
      offset = Math.floor((totalItems / totalPages) * page - 40);

    const data = await this.userRepository.findAll({
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

  private async validateUser(UserEmail: string, id: number): Promise<void> {
    const User = await this.findByEmail(UserEmail);
    if (User && User.id !== id) {
      throw new HttpException(
        'This email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
