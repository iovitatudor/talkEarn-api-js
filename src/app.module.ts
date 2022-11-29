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
import { ContactsModule } from './modules/contacts/contacts.module';
import { Contact } from './modules/contacts/models/contacts.model';
import { ParametersModule } from './modules/parameters/parameters.module';
import { Parameter } from './modules/parameters/models/parameters.model';
import { ContactExpert } from './modules/contacts/models/contact-expert.model';
import { ParameterExpert } from './modules/parameters/models/parameter-expert';
import { FilesModule } from './common/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
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
      models: [
        Project,
        Category,
        Expert,
        Service,
        Contact,
        ContactExpert,
        Parameter,
        ParameterExpert
      ],
    }),
    ProjectsModule,
    CategoriesModule,
    ExpertsModule,
    AuthModule,
    ServicesModule,
    ContactsModule,
    ParametersModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
