import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalData {
  static projectId: any = 0;
  static expertId: any = 0;
  static langId: any = 0;
  static languages: Array<any> = [];
}
