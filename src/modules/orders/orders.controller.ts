import {
  Controller,
  Body,
  Param,
  UseGuards,
  HttpCode,
  Delete,
  Get,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { ClientGuard } from '../auth/guards/client.guard';
import { SetupGuard } from '../auth/guards/setup.guard';
import { OrdersService } from './orders.service';
import { OrdersResource } from './resources/orders.resource';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';

@ApiTags('Orders')
@Controller('api')
export class OrdersController {
  public constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Get all orders per project' })
  @ApiResponse({ status: 200, type: [OrdersResource] })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('orders')
  public async getAll(): Promise<OrdersResource[]> {
    const orders = await this.ordersService.getAll();
    return OrdersResource.collect(orders);
  }

  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200, type: OrdersResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('order/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrdersResource> {
    const order = await this.ordersService.findById(id);
    return new OrdersResource(order);
  }

  @ApiOperation({ summary: 'Get order by token' })
  @ApiResponse({ status: 200, type: OrdersResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('order/token/:token')
  public async getByToken(
    @Param('token') token: string,
  ): Promise<OrdersResource> {
    const order = await this.ordersService.findByToken(token);
    return new OrdersResource(order);
  }

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 200, type: OrdersResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Post('order')
  public async create(
    @Body() orderDto: OrderCreateDto,
  ): Promise<OrdersResource> {
    const order = await this.ordersService.store(orderDto);
    return new OrdersResource(order);
  }

  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 201, type: OrdersResource })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Patch('order/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderDto: OrderUpdateDto,
  ): Promise<OrdersResource> {
    const order = await this.ordersService.update(id, orderDto);
    return new OrdersResource(order);
  }

  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, AdministratorGuard)
  @HttpCode(204)
  @Delete('order/:id')
  public delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.ordersService.destroy(id);
  }
}
