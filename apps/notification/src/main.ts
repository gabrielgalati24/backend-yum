import { NestFactory } from "@nestjs/core";
import { NotificationModule } from "./notification.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { RabbitmqService } from "common/services/rabbitmq.service";

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const rabbitmq = app.get(RabbitmqService);

  app.connectMicroservice(rabbitmq.getRmqOptions("notification_queue"));

  await app.startAllMicroservices();
  await app.listen(configService.get("PORT"));
}
bootstrap();
