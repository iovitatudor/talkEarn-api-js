import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ExpertsModule } from '../experts/experts.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => ProjectsModule),
    forwardRef(() => ExpertsModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'talkEarn-secret',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthModule, JwtModule],
})
export class AuthModule {}
