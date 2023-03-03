import { InjectModel } from '@nestjs/sequelize';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './models/user.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersAuhService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  public async login(userDto: UserLoginDto) {
    const user = await this.validate(userDto);
    const token = this.generateToken(user);
    return { token, user };
  }

  public async register(userDto: UserRegisterDto) {
    const password = userDto.password;
    const hashPassword = await bcrypt.hash(password, 5);

    await this.userRepository.destroy({
      where: { cookie: userDto.cookie, password: null },
    });

    const user = await this.userRepository.create({
      ...userDto,
      password: hashPassword,
      project_id: AuthGuard.projectId,
    });

    const token = this.generateToken(user);

    return { token, user };
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { email, project_id: AuthGuard.projectId },
      include: { all: true },
    });

    if (!user) {
      throw new HttpException(
        'User with this email was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  private async validate(userDto: UserLoginDto): Promise<User> {
    const user = await this.findByEmail(userDto.email);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Email is incorrect',
      });
    }

    const passwordsEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordsEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Email or password is incorrect',
    });
  }

  private generateToken(user: User): string {
    const payload = {
      email: user.email,
      id: user.id,
      projectId: user.project_id,
      name: user.name,
      cookie: user.cookie,
    };
    return this.jwtService.sign(payload);
  }
}
