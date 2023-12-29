import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RabbitmqModule } from 'common/modules/rabbitmq.module';

@Module({
  imports: [
    // RabbitmqModule.registerRmq("PRODUCTS_SERVICE", "products_queue"),
  ],

  providers: [ProductsService],
})
export class ProductsModule { }
