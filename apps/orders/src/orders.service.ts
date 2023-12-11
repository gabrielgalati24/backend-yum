import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'common/database/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { RedisCacheService } from 'common/services/redis-cache.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, @Inject('AUTH_CLIENT') private readonly client: ClientProxy, private readonly cache: RedisCacheService) { }

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
      await this.cache.del('orders');
      return order;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudo crear el pedido', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrders(): Promise<any> {
    try {
      let orders = await this.cache.get('orders');
      if (!orders) {
        orders = await this.prisma.order.findMany({
          include: {
            product: true,
            user: true
          }
        });
        await this.cache.set('orders', orders);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudieron obtener los pedidos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrderById(id: number): Promise<any> {
    try {
      let order = await this.cache.get(`order:${id}`);
      if (!order) {
        order = await this.prisma.order.findUnique({
          where: {
            id: +id
          },
          include: {
            product: true,
            user: true
          }
        });
        await this.cache.set(`order:${id}`, order);
      }
      return order;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudo obtener el pedido', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrder(id: number, updateOrderDto: any): Promise<any> {
    try {
      const { delivered = false, ...rest } = updateOrderDto;

      const currentOrder = await this.prisma.order.findUnique({
        where: {
          id: +id
        }
      });


      const order = await this.prisma.order.update({
        where: {
          id: +id
        },
        data: {
          delivered,
          ...rest
        }
      });

      // Si el pedido no estaba entregado emite el evento order_delivered para enviar la factura
      if (delivered && !currentOrder.delivered) {
        console.log('Emitting order_delivered event');
        this.client.emit('order_delivered', {
          orderId: id
        });
      }

      // Invalida la cache despues de actualizar un pedido
      await this.cache.del('orders');
      await this.cache.del(`order:${id}`);
      return order;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudo actualizar el pedido', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getOrdersByUser(userId: number): Promise<any> {
    try {
      let orders = await this.cache.get(`orders:${userId}`);
      if (!orders) {
        orders = await this.prisma.order.findMany({
          where: {
            userId: +userId
          },
          include: {
            product: true,
            user: true
          }
        });
        await this.cache.set(`orders:${userId}`, orders);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudieron obtener los pedidos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrdersActiveByUser(userId: number): Promise<any> {
    try {
      // let orders = await this.cache.get(`orders:${userId}`);
      let orders = await this.cache.get(`orders-active:${userId}`);
      if (!orders) {
        orders = await this.prisma.order.findMany({
          where: {
            userId: +userId,
            delivered: false
          },
          include: {
            product: true,
            user: true
          }
        });
        await this.cache.set(`orders-active:${userId}`, orders);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudieron obtener los pedidos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
