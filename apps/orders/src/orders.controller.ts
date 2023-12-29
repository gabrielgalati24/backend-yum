import {
  Body,
  Controller,
  ExceptionFilter,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { RabbitMqService } from "common/utils/rmq.service";
import { RpcExceptionFilter } from "common/utils/rcpError";


@Controller("api")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject("ORDERS_SERVICE") private readonly RabbitMqService: RabbitMqService,
  ) { }

  @MessagePattern({ cmd: 'get-orders' })
  async getOrders(@Ctx() context: RmqContext): Promise<any[]> { // Specify the return type as 'Promise<Order[]>'
    this.RabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.getOrders();
  }

  @MessagePattern({ cmd: 'create-order' })
  async createOrder(@Ctx() context: RmqContext, @Payload() createOrderDto: CreateOrderDto): Promise<any[]> {
    this.RabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: 'get-order-by-id' })
  async getOrderById(@Ctx() context: RmqContext, @Payload() id: number) {
    this.RabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.getOrderById(+id);
  }

  @MessagePattern({ cmd: 'update-order' })
  async updateOrder(@Ctx() context: RmqContext, @Payload() data: any) {
    this.RabbitMqService.acknowledgeMessage(context);
    const { id, ...updateOrderDto } = data;

    return await this.ordersService.updateOrder(+id, updateOrderDto);
  }
}


// import { Body, Controller, Get, Param, Patch, Post, Put } from "@nestjs/common";
// import { OrdersService } from "./orders.service";
// import { CreateOrderDto } from "../dto/create-order.dto";
// import { UpdateOrderDto } from "../dto/update-order.dto";

// @Controller("api")
// export class OrdersController {
//   constructor(private readonly ordersService: OrdersService) {}

//   @Post("/v1/orders/create")
//   async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<any> {
//     return await this.ordersService.createOrder(createOrderDto);
//   }

//   @Get("/v1/orders")
//   async getOrders(): Promise<any> {
//     return await this.ordersService.getOrders();
//   }

//   @Get("/v1/orders/:id")
//   async getOrderById(@Param("id") id: number): Promise<any> {
//     return await this.ordersService.getOrderById(+id);
//   }

//   @Patch("/v1/orders/:id")
//   async deliverOrder(
//     @Param("id") id: number,
//     @Body() updateOrderDto: UpdateOrderDto,
//   ): Promise<any> {
//     return await this.ordersService.updateOrder(+id, updateOrderDto);
//   }

//   @Get("/v1/orders/user/:id")
//   async getOrdersByUser(@Param("id") id: number): Promise<any> {
//     return await this.ordersService.getOrdersByUser(+id);
//   }

//   @Get("/v1/orders/user/:id/active")
//   getOrdersActiveByUser(@Param("id") id: number): Promise<any> {
//     return this.ordersService.getOrdersActiveByUser(+id);
//   }
// }
