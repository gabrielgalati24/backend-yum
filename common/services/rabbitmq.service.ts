import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitmqServiceInterface } from 'common/interface';



@Injectable()
export class RabbitmqService implements RabbitmqServiceInterface {
    constructor() { }

    getRmqOptions(queue: string): RmqOptions {


        return {
            transport: Transport.RMQ,
            options: {
                // urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
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