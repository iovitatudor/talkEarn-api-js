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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SellersService } from './sellers.service';
import { SellerCreateDto } from './dto/seller-create.dto';
import { SellerResource } from './resources/sellers.resource';
import { SellerUpdateDto } from './dto/seller-update.dto';
import { ClientGuard } from '../auth/guards/client.guard';
import { SetupGuard } from '../auth/guards/setup.guard';

@ApiTags('Sellers')
@Controller('api')
export class SellersController {
  public constructor(private sellerService: SellersService) {}

  @ApiOperation({ summary: 'Get all sellers per project' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('sellers')
  public async getAll(): Promise<SellerResource[]> {
    const sellers = await this.sellerService.getAll();
    return SellerResource.collect(sellers);
  }

  @ApiOperation({ summary: 'Get seller by id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('seller/:id')
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SellerResource> {
    const service = await this.sellerService.findById(id);
    return new SellerResource(service);
  }

  @ApiOperation({ summary: 'Get seller by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('seller/expert/:id')
  public async getByExpertId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SellerResource> {
    const service = await this.sellerService.findByExpertId(id);
    return new SellerResource(service);
  }

  @ApiOperation({ summary: 'Create seller' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Post('seller')
  public async create(
    @Body() sellerDto: SellerCreateDto,
  ): Promise<SellerResource> {
    const seller = await this.sellerService.store(sellerDto);
    return new SellerResource(seller);
  }

  @ApiOperation({ summary: 'Update seller' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard, SetupGuard)
  @Patch('seller/:id')
  public async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() sellerDto: SellerUpdateDto,
  ): Promise<SellerResource> {
    const service = await this.sellerService.update(id, sellerDto);
    return new SellerResource(service);
  }

  @ApiOperation({ summary: 'Delete seller' })
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('seller/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.sellerService.destroy(id);
  }

  @ApiOperation({ summary: 'Get seller by expert id' })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Get('seller/expert/:expertId')
  public async getSellerByExpertId(
    @Param('expertId', ParseIntPipe) expertId: number,
  ): Promise<SellerResource[]> {
    const services = await this.sellerService.findSellerByExpertId(expertId);
    return SellerResource.collect(services);
  }
}
