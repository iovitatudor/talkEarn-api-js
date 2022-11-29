import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  static projectId: any = 0;
  static expertId: any = 0;

  public constructor(private jwtService: JwtService) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Expert is not authorized.',
        });
      }

      const expert = this.jwtService.verify(token);
      req.expert = expert;
      AuthGuard.projectId = expert.projectId;
      AuthGuard.expertId = expert.id;

      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Expert is not authorized.' });
    }
  }
}