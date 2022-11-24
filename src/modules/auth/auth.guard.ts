import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

export class AuthGuard implements CanActivate {
  public constructor(private jwtService: JwtService) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'bearer' || !token) {
        throw new UnauthorizedException({ message: 'Expert is not authorized.' });
      }

      const expert = this.jwtService.verify(token);
      req.expert = expert;

      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Expert is not authorized.' });
    }
  }
}