import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientProxy, ClientProxyFactory, RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitmqServiceInterface } from 'common/interface';



@Injectable()
export class RabbitmqService implements RabbitmqServiceInterface {
    private clients: { [key: string]: ClientProxy } = {};
    constructor(private configService: ConfigService) { }

    getRmqOptions(queue: string): RmqOptions {



        return {
            transport: Transport.RMQ,
            options: {

                urls: [this.configService.get<string>('RABBITMQ_URL')],
                noAck: true,
                queue,
                queueOptions: {
                    durable: true,
                },
            },
        };
    }

    acknowledgeMessage(context: RmqContext) {
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);
    }

    getClient(queue: string): ClientProxy {
        if (!this.clients[queue]) {
            this.clients[queue] = ClientProxyFactory.create(this.getRmqOptions(queue));
        }
        return this.clients[queue];
    }

    async emitMessage(queue: string, message: any) {
        const client = this.getClient(queue);
        return client.emit(queue, message).toPromise();
    }

}