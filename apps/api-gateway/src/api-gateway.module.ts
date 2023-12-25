import { Module } from "@nestjs/common";
import { ApiGatewayController } from "./api-gateway.controller";

import { RabbitmqModule } from "common/modules/rabbitmq.module";
// import { ProductsService } from 'apps/products/src/products.service';

@Module({
  imports: [RabbitmqModule.registerRmq("PRODUCTS_SERVICE", "products_queue")],
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule {}
