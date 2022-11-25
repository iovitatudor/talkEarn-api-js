import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TalkEarn API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  SwaggerModule.setup('/', app, document);

  await app.listen(PORT, () => {
    console.log(`Server started on http://127.0.0.1:${PORT}`);
  });
}

bootstrap();
