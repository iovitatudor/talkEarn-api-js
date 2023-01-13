import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Types } from '../../experts/enums/types.enum';

@Injectable()
export class AdministratorGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log(req.expert);
    try {
      if (req.expert.type !== Types.Administrator) {
        throw new UnauthorizedException({
          message: 'This action is only allowed for project administrator.',
        });
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'This action is only allowed for project administrator.',
      });
    }
  }
}