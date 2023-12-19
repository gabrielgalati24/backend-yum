import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'common/database/prisma.service';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { RedisModule } from 'common/modules/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products/.env',
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
    RedisModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
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
export class ProductsModule {}
