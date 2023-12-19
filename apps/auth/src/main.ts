import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Auth API')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log(configService.get('PORT'));
  await app.listen(configService.get('PORT'));
}
bootstrap();
