import { NestFactory } from "@nestjs/core";
import { ProductsModule } from "./products.module";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { RabbitMqService } from "common/utils/rmq.service";
import { RabbitmqService } from "common/services/rabbitmq.service";
async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("Products API")
    .setDescription("Products API")
    .setVersion("1.0")
    .addTag("products")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const rabbitmq = app.get(RabbitmqService);
  // await app.connectMicroservice<MicroserviceOptions>({ transport: Transport.RMQ, options: { urls: [configService.get("RABBITMQ_URL")], queue: configService.get("RABBITMQ_QUEUE"), queueOptions: { durable: false } } });
  app.connectMicroservice(rabbitmq.getRmqOptions("products_queue"));
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ["amqp://localhost:5672"],
  //     queue: "products_queue",
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });
  await app.startAllMicroservices();
  await app.listen(configService.get("PORT"));
}
bootstrap();
