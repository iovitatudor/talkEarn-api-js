import {
  Controller,
  Query,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as twilio from 'twilio';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Calls')
@Controller('api')
export class CallsController {
  @Get('/calls/token')
  @ApiOperation({ summary: 'Get Twilio token' })
  @ApiResponse({ status: 200 })
  public async getToken(@Query('identity') identity: string): Promise<{ identity: string; token: any }> {
    if (!identity) {
      throw new HttpException('Identity is required.', HttpStatus.BAD_REQUEST);
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;
    const grant = new VideoGrant();

    const token = await new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_KEY_SID,
      process.env.TWILIO_SECRET,
    );

    token.identity = identity;
    token.addGrant(grant);

    return {
      identity: identity,
      token: token.toJwt(),
    };
  }
}
