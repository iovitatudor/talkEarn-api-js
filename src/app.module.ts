import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { ProjectsModule } from './modules/projects/projects.module';
import { Project } from './modules/projects/models/projects.model';
import { CategoriesModule } from './modules/categories/categories.module';
import { Category } from './modules/categories/models/categories.model';
import { ExpertsModule } from './modules/experts/experts.module';
import { Expert } from './modules/experts/models/experts.model';
import { AuthModule } from './modules/auth/auth.module';
import { ServicesModule } from './modules/services/services.module';
import { Service } from './modules/services/models/services.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      models: [Project, Category, Expert, Service],
    }),
    ProjectsModule,
    CategoriesModule,
    ExpertsModule,
    AuthModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
