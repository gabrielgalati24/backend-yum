import { Controller, Get, Post, Body, Patch, Param, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(
    @Inject("ORDERS_SERVICE") private readonly ordersRabbitmq: ClientProxy,
  ) { }

  @Get("")
  getOrders() {
    return this.ordersRabbitmq.send({ cmd: "get-orders" }, {});
  }

  @Post("create")
  createOrder(
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersRabbitmq.send({ cmd: "create-order" }, createOrderDto);
  }

  @Get(":id")
  getOrderById(@Param("id") id: number) {
    console.log({ id });

    return this.ordersRabbitmq.send({ cmd: "get-order-by-id" }, id);
  }

  @Patch(":id")
  updateOrder(@Param("id") id: number, @Body() updateOrderDto: CreateOrderDto) {
    return this.ordersRabbitmq.send({ cmd: "update-order" }, { id: id, ...updateOrderDto });
  }
}
