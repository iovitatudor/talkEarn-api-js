import {
  Body,
  Controller,
  Param,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Query,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UsersResource } from './resources/users.resource';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { ClientGuard } from '../auth/guards/client.guard';
import { UserAssigmentDto } from './dto/user-assigment.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UsersAuhService } from './users-auh.service';

@ApiTags('Users')
@Controller('api')
export class UsersController {
  public constructor(
    private userService: UsersService,
    private userAuthService: UsersAuhService,
  ) {}

  @ApiOperation({ summary: 'User log in' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('ClientGuard')
  @Post('user/login')
  public async loginUser(@Body() userDto: UserLoginDto) {
    const data = await this.userAuthService.login(userDto);
    return { user: new UsersResource(data.user), token: data.token };
  }

  @ApiOperation({ summary: 'User register' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('ClientGuard')
  @Post('user/register')
  public async registerUser(@Body() userDto: UserRegisterDto) {
    const data = await this.userAuthService.register(userDto);
    return { user: new UsersResource(data.user), token: data.token };
  }

  @ApiOperation({ summary: 'Get all users per project' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('users')
  public async getAll(@Query() query) {
    const page = query.page;
    const online = query.online;
    const expert_id = query.expert_id;

    const users = await this.userService.getAll(page, online, expert_id);
    return UsersResource.collect(users.data, users.meta);
  }

  @ApiOperation({ summary: 'Get user by Id' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('user/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UsersResource> {
    const expert = await this.userService.findById(id);
    return new UsersResource(expert);
  }

  @ApiOperation({ summary: 'Create user' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('user')
  public async create(
    @Body() userDto: UserCreateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<UsersResource> {
    const expert = await this.userService.store(userDto, avatar);
    return new UsersResource(expert);
  }

  @ApiOperation({ summary: 'Change user assignment' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(201)
  @Patch('user/assignment')
  public async changeAssignment(
    @Body() userDto: UserAssigmentDto,
  ): Promise<UsersResource> {
    const user = await this.userService.changeClientAssignment(userDto);
    return new UsersResource(user);
  }

  @ApiOperation({ summary: 'Update User' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('user/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: UserUpdateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<UsersResource> {
    const user = await this.userService.update(id, userDto, avatar);
    return new UsersResource(user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(204)
  @Delete('user/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.userService.destroy(id);
  }

  @ApiOperation({ summary: 'Toggle user status' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(201)
  @Patch('user/status/:id')
  public async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UsersResource> {
    const user = await this.userService.toggleStatus(id);
    return new UsersResource(user);
  }

  @ApiOperation({ summary: 'Search users per project' })
  @UseGuards(ClientGuard)
  @ApiBearerAuth('Authorization')
  @Get('users/search')
  public async search(@Query() query) {
    const page = query.page;
    const search = query.search;

    const users = await this.userService.search(page, search);
    return UsersResource.collect(users.data, users.meta);
  }
}
