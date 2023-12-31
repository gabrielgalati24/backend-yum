import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RabbitmqService } from 'common/services/rabbitmq.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './.env',
        }),
    ],
    providers: [RabbitmqService],
    exports: [RabbitmqService],
})
export class RabbitmqModule {
    static registerRmq(service: string, queue: string): DynamicModule {
        const providers = [
            {
                provide: service,
                useFactory: (configService: ConfigService) => {
                    const rabbitmqUrl = configService.get<string>('RABBITMQ_URL');
                    return ClientProxyFactory.create({
                        transport: Transport.RMQ,
                        options: {
                            urls: [rabbitmqUrl],
                            queue,
                            noAck: true,
                            queueOptions: {
                                durable: true, // queue survives broker restart
                            },
                        },
                    });
                },
                inject: [ConfigService],
            },
        ];

        return {
            module: RabbitmqModule,
            providers,
            exports: providers,
        };
    }
}