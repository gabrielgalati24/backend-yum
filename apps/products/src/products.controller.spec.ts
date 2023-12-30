import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

import { PrismaService } from "../../../common/database/prisma.service";
import { RedisCacheService } from "../../../common/services/redis-cache.service";
import { CacheModule } from "@nestjs/cache-manager";
import { ClientProxyFactory, RmqContext, Transport } from "@nestjs/microservices";
import { RabbitmqService } from "../../../common/services/rabbitmq.service";
import { ConfigModule } from "@nestjs/config";


describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), ConfigModule.forRoot()],
      controllers: [ProductsController],
      providers: [
        ProductsService,
        PrismaService,
        RedisCacheService,
        {
          provide: "PRODUCTS_SERVICE",
          useClass: RabbitmqService,
        }
      ],
    }).compile();

    controller = app.get<ProductsController>(ProductsController);
    service = app.get<ProductsService>(ProductsService);
  });

  describe("getProducts", () => {
    it("should return an array of products", async () => {
      const mockRmqContext: any = {
        getChannelRef: jest.fn().mockReturnValue({ ack: jest.fn() }),
        getMessage: jest.fn(),
        getPattern: jest.fn(),
        args: [null, null, null] as any,
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
      };
      const products: any = [
        { id: 1, name: "Product 1", price: 100, shopId: 1 },
        { id: 2, name: "Product 2", price: 200, shopId: 1 },
      ];
      jest.spyOn(service, "getProducts").mockResolvedValue(products);

      const result = await controller.getProducts(mockRmqContext);

      expect(result).toEqual(products);
    });
  });

  it("should create a new product", async () => {
    const mockRmqContext: any = {
      getChannelRef: jest.fn().mockReturnValue({ ack: jest.fn() }),
      getMessage: jest.fn(),
      getPattern: jest.fn(),
      args: [null, null, null] as any,
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
    };
    const createProductDto = { name: "New Product", price: 100, shopId: 1 };
    const createdProduct = {
      id: 1,
      name: "New Product",
      price: 100,
      shopId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, "createProduct").mockResolvedValue(createdProduct);

    const result = await controller.createProduct(mockRmqContext, createProductDto);

    expect(result).toEqual(createdProduct);
  });

  it("should return a product by id", async () => {
    const mockRmqContext: any = {
      getChannelRef: jest.fn().mockReturnValue({ ack: jest.fn() }),
      getMessage: jest.fn(),
      getPattern: jest.fn(),
      args: [null, null, null] as any,
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
    };
    const id = 1;
    const product = { id: 1, name: "Product 1" };
    jest.spyOn(service, "getProductById").mockResolvedValue(product);

    const result = await controller.getProductById(mockRmqContext, id);

    expect(result).toEqual(product);
  });
});