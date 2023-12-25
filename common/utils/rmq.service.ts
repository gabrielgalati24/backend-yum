import { Injectable } from "@nestjs/common";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitMqService {
    constructor() { }

    getRmqOptions(queue: string): RmqOptions {


        return {
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://nestjs-rabbitmq:5672`],
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