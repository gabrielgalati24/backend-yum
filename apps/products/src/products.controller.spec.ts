

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { PrismaService } from '../../../common/database/prisma.service';
import { RedisCacheService } from '../../../common/services/redis-cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [ProductsController],
      providers: [ProductsService, PrismaService, RedisCacheService, {
        provide: 'AUTH_CLIENT',
        useFactory: () => {
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'auth_queue',
              queueOptions: {
                durable: false,
              },
            },
          });
        },
      }],
    }).compile();

    controller = app.get<ProductsController>(ProductsController);
    service = app.get<ProductsService>(ProductsService);
  });


  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products: any = [{ id: 1, name: 'Product 1', price: 100, shopId: 1 }, { id: 2, name: 'Product 2', price: 200, shopId: 1 }];
      jest.spyOn(service, 'getProducts').mockResolvedValue(products);

      const result = await controller.getProducts();

      expect(result).toEqual(products);

    });
  });

  it('should create a new product', async () => {
    const createProductDto = { name: 'New Product', price: 100, shopId: 1 };
    const createdProduct = { id: 1, name: 'New Product', price: 100, shopId: 1, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(service, 'createProduct').mockResolvedValue(createdProduct);

    const result = await controller.createProduct(createProductDto);

    expect(result).toEqual(createdProduct);
  });

  it('should return a product by id', async () => {
    const id = 1;
    const product = { id: 1, name: 'Product 1' };
    jest.spyOn(service, 'getProductById').mockResolvedValue(product);

    const result = await controller.getProductById(id);

    expect(result).toEqual(product);
  });
});