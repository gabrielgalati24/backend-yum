import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { PrismaService } from "common/database/prisma.service";
import { ConfigModule } from "@nestjs/config";
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { RedisModule } from "common/modules/redis.module";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { LoggingInterceptor } from "../logging.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RabbitmqModule } from "common/modules/rabbitmq.module";
import { RabbitmqService } from "common/services/rabbitmq.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/orders/.env",
    }),
    PrometheusModule.register(),
    RabbitmqModule,
    RabbitmqModule.registerRmq("ORDERS_SERVICE", "orders_queue"),
    RabbitmqModule.registerRmq("NOTIFICATION_SERVICE", "notification_queue"),
    RedisModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: "ORDERS_SERVICE",
      useClass: RabbitmqService,
    },

  ],
})
export class OrdersModule { }
