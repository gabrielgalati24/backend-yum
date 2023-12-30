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

import { RabbitmqModule } from "common/modules/rabbitmq.module";
import { RabbitmqService } from "common/services/rabbitmq.service";

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
      useClass: RabbitmqService,
    }
  ],
})
export class AuthModule { }
