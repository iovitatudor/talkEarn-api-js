import {
  Body,
  Controller,
  UsePipes,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ProjectWithAdminDto } from './dto/project-with-admin.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResource } from './resources/auth.resource';

@ApiTags('Projects')
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create Project and Administrator' })
  @ApiResponse({ status: 201, description: 'Application Token' })
  @UsePipes(ValidationPipe)
  @Post('/register')
  public async register(
    @Body() projectWithAdminDto: ProjectWithAdminDto,
  ): Promise<AuthResource> {
    const data = await this.authService.register(projectWithAdminDto);
    return new AuthResource(data);
  }

  @ApiOperation({ summary: 'Get Application Token' })
  @ApiResponse({ status: 201, description: 'Application Token' })
  @Post('/login')
  public async login(@Body() loginDto: LoginDto): Promise<AuthResource> {
    const data = await this.authService.login(loginDto);
    return new AuthResource(data);
  }
}
