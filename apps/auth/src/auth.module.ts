import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";

import { PrismaService } from "common/database/prisma.service";
import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { RabbitMqService } from "common/utils/rmq.service";
import { RmqModule } from "common/utils/rmq.module";
import { RabbitmqModule } from "common/modules/rabbitmq.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/auth/.env",
    }),

    RabbitmqModule.registerRmq("AUTH_SERVICE", "auth_queue"),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: "AUTH_SERVICE",
      useClass: RabbitMqService,
    }
  ],
})
export class AuthModule { }
