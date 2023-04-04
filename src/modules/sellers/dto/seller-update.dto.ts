import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty} from "class-validator";

export class SellerUpdateDto {
  @ApiProperty({ example: 1 })
  expert_id: number;

  @ApiProperty({ example: '' })
  merchant_id: string;

  @ApiProperty({ example: '' })
  merchant_id_in_paypal: string;

  @ApiProperty({ example: '' })
  permissions_granted: string;

  @ApiProperty({ example: '' })
  consent_status: string;

  @ApiProperty({ example: '' })
  product_intent_id: string;

  @ApiProperty({ example: '' })
  is_email_confirmed: boolean;

  @ApiProperty({ example: '' })
  account_status: string;
}
