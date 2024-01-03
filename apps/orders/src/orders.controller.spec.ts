import { Test, TestingModule } from "@nestjs/testing";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { RabbitmqService } from "../../../common/services/rabbitmq.service";
import { PrismaService } from "../../../common/database/prisma.service";
import { RedisCacheService } from "../../../common/services/redis-cache.service";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

describe("OrdersController", () => {
    let controller: OrdersController;
    let service: OrdersService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register(), ConfigModule.forRoot()],
            controllers: [OrdersController],
            providers: [
                OrdersService,
                PrismaService,
                RedisCacheService,
                {
                    provide: "ORDERS_SERVICE",
                    useClass: RabbitmqService,
                },
                {
                    provide: 'NOTIFICATION_SERVICE',
                    useValue: {
                        emit: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = app.get<OrdersController>(OrdersController);
        service = app.get<OrdersService>(OrdersService);
    });

    describe("getOrders", () => {
        it("should return an array of orders", async () => {
            const orders: any[] = [
                { id: 2, name: "Order 1" },
                { id: 2, name: "Order 2" },
            ];
            jest.spyOn(service, "getOrders").mockResolvedValue(orders);

            const result = await controller.getOrders(null);

            expect(result).toEqual(orders);
        });
    });

    describe("createOrder", () => {
        it("should create a new order", async () => {
            const createOrderDto = { name: "New Order", productId: 1, userId: 1 };
            const createdOrder = { id: 1, name: "New Order", delivered: false, productId: 1, userId: 1 };
            jest.spyOn(service, "createOrder").mockResolvedValue(createdOrder);

            const result = await controller.createOrder(null, createOrderDto);

            expect(result).toEqual(createdOrder);
        });
    });

    describe("getOrderById", () => {
        it("should return an order by id", async () => {
            const id = 1;
            const order = { id: 1, name: "Order 1", delivered: false, productId: 1, userId: 1 };
            jest.spyOn(service, "getOrderById").mockResolvedValue(order);

            const result = await controller.getOrderById(null, id);

            expect(result).toEqual(order);
        });
    });


});