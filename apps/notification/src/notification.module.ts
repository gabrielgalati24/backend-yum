import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { PrismaService } from "common/database/prisma.service";
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/notification/.env",
    }),
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://nestjs-rabbitmq:5672"],

          queue: "auth_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PrismaService,
    {
      provide: "AUTH_CLIENT",
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://nestjs-rabbitmq:5672"],

            queue: "auth_queue",
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
})
export class NotificationModule {}
