import { Module } from "@nestjs/common";


import { RabbitmqModule } from "common/modules/rabbitmq.module";


// import { ProductsService } from 'apps/products/src/products.service';
import { AuthModule } from './auth/auth.module';
import { OrdersController } from "./orders/orders.controller";
import { ProductsController } from "./products/products.controller";
import { ProductsModule } from "./products/products.module";
import { AuthController } from "./auth/auth.controller";

@Module({
  imports: [

    RabbitmqModule.registerRmq("ORDERS_SERVICE", "orders_queue"),

    RabbitmqModule.registerRmq("PRODUCTS_SERVICE", "products_queue"),

    RabbitmqModule.registerRmq("AUTH_SERVICE", "auth_queue"),
    // ProductsModule

  ],
  controllers: [OrdersController, ProductsController, AuthController],
})
export class ApiGatewayModule { }
