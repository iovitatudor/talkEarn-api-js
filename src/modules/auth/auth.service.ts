import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ExpertsService } from '../experts/experts.service';
import { Expert } from '../experts/models/experts.model';
import { ProjectsService } from '../projects/projects.service';
import { ProjectWithAdminDto } from './dto/project-with-admin.dto';
import { LoginDto } from './dto/login.dto';
import {Types} from "../experts/enums/types.enum";

@Injectable()
export class AuthService {
  constructor(
    private projectService: ProjectsService,
    private expertService: ExpertsService,
    private jwtService: JwtService,
  ) {}

  public async login(expertDto: LoginDto) {
    const expert = await this.validate(expertDto);
    return this.generateToken(expert);
  }

  public async register(projectWithAdminDto: ProjectWithAdminDto) {
    const administrator = projectWithAdminDto.administrator;
    delete projectWithAdminDto.administrator;

    await this.validateProject(projectWithAdminDto.name);

    await this.validateExpert(administrator.email);

    const project = await this.projectService.create(projectWithAdminDto);

    const hashPassword = await bcrypt.hash(administrator.password, 5);

    const expert = await this.expertService.partialStore({
      ...administrator,
      password: hashPassword,
      project_id: project.id,
      type: Types.Administrator,
    });

    return this.generateToken(expert);
  }

  private generateToken(expert: Expert) {
    const payload = { email: expert.email, id: expert.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validate(expertDto: LoginDto) {
    const expert = await this.expertService.findByEmail(expertDto.email);

    if (!expert) {
      throw new UnauthorizedException({
        message: 'Email is incorrect',
      });
    }

    const passwordsEquals = await bcrypt.compare(
      expertDto.password,
      expert.password,
    );

    if (expert && passwordsEquals) {
      return expert;
    }

    throw new UnauthorizedException({
      message: 'Email or password is incorrect',
    });
  }

  private async validateProject(projectName: string) {
    const projectExists = await this.projectService.getByName(projectName);

    if (projectExists) {
      throw new HttpException(
        'Project name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateExpert(email: string) {
    const candidate = await this.expertService.findByEmail(email);

    if (candidate) {
      throw new HttpException(
        'Expert email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
