import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://nestjs-rabbitmq:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));

}
bootstrap();
