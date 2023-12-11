import { Injectable } from "@nestjs/common";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitMqService {
    constructor(private readonly config) { }

    getRmqOptions(queue: string): RmqOptions {
        const USER = this.config.get('RABBITMQ_USER');
        const PASSWORD = this.config.get('RABBITMQ_PASS');
        const HOST = this.config.get('RABBITMQ_HOST');

        return {
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
                noAck: false,
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
}