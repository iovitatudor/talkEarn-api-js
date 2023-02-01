import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExpertDeviceTokenAddDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'f7CR5J-DSa6hBPHMERz84L:APA91bFI8LPwf5P1Kk7wcWStjB6XxVlQ8Nn20o5ezRVSlcjv-z97m7ocog-1W2eXKTkn-h8j6t81p5Fo_hGmZhUrOOT-pwXmJhBK9vFkrlBx96LhKzV9YRSqN5rcls9IUvPXxck_tL5e',
    description: 'Expert device token',
  })
  public deviceToken: string;
}
