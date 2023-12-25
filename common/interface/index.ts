
import { RmqContext, RmqOptions } from '@nestjs/microservices';

interface Order {
    id: number;
    delivered: boolean;
    userId: number;
    productId: number;
}

export interface RabbitmqServiceInterface {
    getRmqOptions(queue: string): RmqOptions;
    acknowledgeMessage(context: RmqContext): void;
}