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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/orders/.env",
    }),
    PrometheusModule.register(),
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://nestjs-rabbitmq:5672"],

          queue: "notifications_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
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
      provide: "AUTH_CLIENT",
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://nestjs-rabbitmq:5672"],

            queue: "notifications_queue",
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
})
export class OrdersModule {}
