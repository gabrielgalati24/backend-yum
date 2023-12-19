import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from 'common/database/prisma.service';
import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { RabbitMqService } from 'common/utils/rmq.service';
import { RmqModule } from 'common/utils/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://nestjs-rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: 'AUTH_CLIENT',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://nestjs-rabbitmq:5672'],
            queue: 'auth_queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
})
export class AuthModule {}
