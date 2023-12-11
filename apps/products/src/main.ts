import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const configService = app.get(ConfigService);


  const config = new DocumentBuilder()
    .setTitle('Products API')
    .setDescription('Products API')
    .setVersion('1.0')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
