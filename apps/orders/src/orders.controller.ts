import { Controller, Inject } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { RmqContext, MessagePattern, Ctx, Payload, } from "@nestjs/microservices";
import { RabbitmqService } from "../../../common/services/rabbitmq.service";


@Controller("api")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject("ORDERS_SERVICE") private readonly RabbitMqService: RabbitmqService,
  ) { }

  @MessagePattern({ cmd: 'get-orders' })
  async getOrders(@Ctx() context: RmqContext): Promise<any[]> {

    return await this.ordersService.getOrders();
  }

  @MessagePattern({ cmd: 'create-order' })
  async createOrder(@Ctx() context: RmqContext, @Payload() createOrderDto: CreateOrderDto) {


    return await this.ordersService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: 'get-order-by-id' })
  async getOrderById(@Ctx() context: RmqContext, @Payload() id: number) {

    return await this.ordersService.getOrderById(+id);
  }

  @MessagePattern({ cmd: 'update-order' })
  async updateOrder(@Ctx() context: RmqContext, @Payload() data: any) {

    const { id, ...updateOrderDto } = data;

    return await this.ordersService.updateOrder(+id, updateOrderDto);
  }
}

