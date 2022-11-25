import {
  Body,
  Controller,
  UsePipes,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Project } from '../projects/models/projects.model';
import { ProjectWithAdminDto } from './dto/project-with-admin.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Projects')
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create Project and Administrator' })
  @ApiResponse({ status: 201, description: 'Get App Token' })
  @UsePipes(ValidationPipe)
  @Post('/register')
  public register(
    @Body() projectWithAdminDto: ProjectWithAdminDto,
  ): Promise<object> {
    return this.authService.register(projectWithAdminDto);
  }

  @ApiOperation({ summary: 'Get Application Token' })
  @ApiResponse({ status: 201, type: Project })
  @Post('/login')
  public login(@Body() loginDto: LoginDto): Promise<object> {
    return this.authService.login(loginDto);
  }
}
