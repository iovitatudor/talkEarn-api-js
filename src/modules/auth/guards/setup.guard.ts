import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GlobalData } from './global-data';
import { LanguagesService } from '../../languages/languages.service';

@Injectable()
export class SetupGuard implements CanActivate {
  public constructor(private languagesService: LanguagesService) {}

  public async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      const langQuery = req.query.lang;

      if (langQuery) {
        const language = await this.languagesService.findByAbbr(langQuery);
        GlobalData.langId = language.id;
      } else {
        const language = await this.languagesService.getDefaultLanguage();
        GlobalData.langId = language.id;
      }

      GlobalData.languages = await this.languagesService.getAll();

      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'You need to add default language',
      });
    }
  }
}
