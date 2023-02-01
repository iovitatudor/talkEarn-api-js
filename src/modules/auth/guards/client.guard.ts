import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ProjectsService } from '../../projects/projects.service';

@Injectable()
export class ClientGuard implements CanActivate {
  public constructor(
    private jwtService: JwtService,
    private projectsService: ProjectsService,
  ) {}

  public async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    // try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if ((bearer !== 'Bearer' && bearer !== 'Basic') || !token) {
        throw new UnauthorizedException({
          message: 'You are not authorizedvlfml.',
        });
      }

      if (bearer === 'Bearer') {
        const expert = this.jwtService.verify(token);
        req.expert = expert;
        AuthGuard.projectId = expert.projectId;
        AuthGuard.expertId = expert.id;
      }

      if (bearer === 'Basic') {
        const project = await this.projectsService.findByToken(token);
        req.expert = project.administrator;
        AuthGuard.projectId = project.id;
        AuthGuard.expertId = project.administrator.id;
        console.log(AuthGuard.projectId);
      }

      return true;
    // } catch (e) {
    //   throw new UnauthorizedException({ message: 'You are not authorized.' });
    // }
  }
}
