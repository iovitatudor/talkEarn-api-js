import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesResource } from '../categories/resources/categories.resource';
import { PaymentsService } from './payments.service';
import { ClientGuard } from '../auth/guards/client.guard';
import { SetupGuard } from '../auth/guards/setup.guard';

@ApiTags('Payments')
@Controller('api')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @ApiOperation({ summary: 'Create payment order' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Post('payments/order/:orderId')
  public async createPaymentOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.paymentService.createOrder(orderId);
  }

  @ApiOperation({ summary: 'Capture payment' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('Authorization')
  @UseGuards(ClientGuard, SetupGuard)
  @Post('payments/order/:orderId/capture')
  public async capturePayment(@Param('orderId') orderId: string) {
    return this.paymentService.capturePayment(orderId, 1);
  }
}
