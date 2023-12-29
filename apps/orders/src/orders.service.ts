import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "common/database/prisma.service";
import { CreateOrderDto } from "../dto/create-order.dto";

import { ClientProxy, RpcException } from "@nestjs/microservices";
import { RedisCacheService } from "common/services/redis-cache.service";
import { RabbitMqService } from "common/utils/rmq.service";
interface Order {
  id: number;
  delivered: boolean;
  userId: number;
  productId: number;
}
@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,

    @Inject("NOTIFICATION_SERVICE") private readonly RabbitMqService: RabbitMqService,
    private readonly cache: RedisCacheService,

  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { userId, productId } = createOrderDto;
      const order = await this.prisma.order.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
        },
      });
      // Invalidate the cache after an order is created
      await this.cache.del("orders");
      return order;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "No se pudo crear el pedido",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      let orders = (await this.cache.get("orders")) as Order[];
      if (!orders) {
        orders = await this.prisma.order.findMany({
          include: {
            product: true,
            user: true,
          },
        });
        await this.cache.set("orders", orders);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "No se pudieron obtener los pedidos",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderById(id: number): Promise<Order> {
    try {
      let order = (await this.cache.get(`order:${id}`)) as Order;
      if (!order) {
        order = await this.prisma.order.findUnique({
          where: {
            id: +id,
          },
          include: {
            product: true,
            user: true,
          },
        });
        await this.cache.set(`order:${id}`, order);
      }
      return order;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "No se pudo obener el pedido",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(id: number, updateOrderDto: any): Promise<Order> {
    try {
      const { delivered = false, ...rest } = updateOrderDto;


      console.log("Updating order", id, updateOrderDto);
      const currentOrder = await this.prisma.order.findUnique({
        where: {
          id: +id,
        },
      });

      const order = await this.prisma.order.update({
        where: {
          id: +id,
        },
        data: {
          delivered,
          ...rest,
        },
      });

      // Si el pedido no estaba entregado emite el evento order_delivered para enviar la factura
      if (delivered && !currentOrder.delivered) {

        this.RabbitMqService.emit(this.RabbitMqService.client, "order_delivered", {
          orderId: id,
        });

      }

      // Invalida la cache despues de actualizar un pedido
      await this.cache.del("orders");
      await this.cache.del(`order:${id}`);
      return order;
    } catch (error) {
      console.error(error);
      if (
        error.code === "P2025"
      ) {
        throw new RpcException({
          message: 'No se pudo actualizar el pedido porque no existe',
          statusCode: HttpStatus.NOT_FOUND,
          error: error.message,
        });
      }
      throw new RpcException({
        message: 'No se pudo actualizar el pedido',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      })
    }
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    try {
      let orders = (await this.cache.get(`orders:${userId}`)) as Order[];
      if (!orders) {
        orders = await this.prisma.order.findMany({
          where: {
            userId: +userId,
          },
          include: {
            product: true,
            user: true,
          },
        });
        await this.cache.set(`orders:${userId}`, orders);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "No se pudieron obtener los pedidos",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrdersActiveByUser(userId: number): Promise<Order[]> {
    try {
      let orders = (await this.cache.get(`orders-active:${userId}`)) as Order[];
      if (!orders) {
        orders = await this.prisma.order.findMany({
          where: {
            userId: +userId,
            delivered: false,
          },
          include: {
            product: true,
            user: true,
          },
        });
        await this.cache.set(`orders-active:${userId}`, orders);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "No se pudieron obtener los pedidos",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
