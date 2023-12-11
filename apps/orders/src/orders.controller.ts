import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Controller("api")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post("/v1/orders/create")
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get("/v1/orders")
  async getOrders(): Promise<any> {
    return await this.ordersService.getOrders();
  }

  @Get("/v1/orders/:id")
  async getOrderById(@Param('id') id: number): Promise<any> {
    return await this.ordersService.getOrderById(+id);
  }

  @Patch("/v1/orders/:id")
  async deliverOrder(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<any> {
    return await this.ordersService.updateOrder(+id, updateOrderDto);
  }

  @Get("/v1/orders/user/:id")
  async getOrdersByUser(@Param('id') id: number): Promise<any> {
    return await this.ordersService.getOrdersByUser(+id);
  }

  @Get("/v1/orders/user/:id/active")
  getOrdersActiveByUser(@Param('id') id: number): Promise<any> {
    return this.ordersService.getOrdersActiveByUser(+id);
  }
}
