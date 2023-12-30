import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RabbitmqService } from "common/services/rabbitmq.service";
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle("Auth API")
    .setDescription("Auth API")
    .setVersion("1.0")
    .addTag("auth")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const rabbitmq = app.get(RabbitmqService);

  app.connectMicroservice(rabbitmq.getRmqOptions("auth_queue"));

  await app.startAllMicroservices();

  await app.listen(configService.get("PORT"));
}
bootstrap();
