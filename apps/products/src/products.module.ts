import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "common/database/prisma.service";
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { RedisModule } from "common/modules/redis.module";
import { RabbitmqModule } from "common/modules/rabbitmq.module";
import { RabbitmqService } from "common/services/rabbitmq.service";
import { RabbitMqService } from "common/utils/rmq.service";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/products/.env",
    }),
    RabbitmqModule,
    RabbitmqModule.registerRmq("PRODUCTS_SERVICE", "products_queue"),
    RedisModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,


    {
      provide: "PRODUCTS_SERVICE",
      useClass: RabbitMqService,
    }

  ],
  exports: [RabbitmqModule],
})
export class ProductsModule { }
