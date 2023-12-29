import { NestFactory } from "@nestjs/core";
import { OrdersModule } from "./orders.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RabbitmqService } from "common/services/rabbitmq.service";

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle("Orders API")
    .setDescription("Orders API")
    .setVersion("1.0")
    .addTag("orders")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const rabbitmq = app.get(RabbitmqService);

  app.connectMicroservice(rabbitmq.getRmqOptions("orders_queue"));

  await app.startAllMicroservices();
  await app.listen(configService.get("PORT"));
}
bootstrap();
