import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, RmqContext, RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitMqService {

    public client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create(this.getRmqOptions('notifications_queue'));
    }


    getRmqOptions(queue: string): RmqOptions {


        return {
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://nestjs-rabbitmq:5672`],
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

    emit(client: any, pattern: string, data: any) {
        return client.emit(pattern, data);
    }
}