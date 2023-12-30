import {
  Body,
  Controller,
  ExceptionFilter,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  // RpcExceptionFilter,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "../dto/create-product.dto";
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { CreateShopDto } from "../dto/create-shop.dto";
import { RabbitmqService } from "../../../common/services/rabbitmq.service";

@Controller("api")
// @UseFilters(new RpcExceptionFilter())
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject("PRODUCTS_SERVICE") private readonly RabbitMqService: RabbitmqService,
  ) { }

  @MessagePattern({ cmd: 'get-products' })
  async getProducts(@Ctx() context: RmqContext) {

    this.RabbitMqService.acknowledgeMessage(context);

    return await this.productsService.getProducts();
  }

  @MessagePattern({ cmd: 'create-product' })
  async createProduct(@Ctx() context: RmqContext, @Payload() createProductDto: CreateProductDto) {
    this.RabbitMqService.acknowledgeMessage(context);

    return await this.productsService.createProduct(createProductDto);
  }



  @MessagePattern({ cmd: 'create-shop' })
  async createShop(@Payload() createShopDto: CreateShopDto) {

    return await this.productsService.createShop(createShopDto);
  }

  @MessagePattern({ cmd: 'get-product-by-id' })
  async getProductById(@Ctx() context: RmqContext, @Payload() id: number) {

    this.RabbitMqService.acknowledgeMessage(context);

    return await this.productsService.getProductById(+id);
  }

  @MessagePattern({ cmd: 'update-product' })
  async updateProduct(
    @Ctx() context: RmqContext,
    @Payload() data: any,
  ) {
    this.RabbitMqService.acknowledgeMessage(context);

    const { id, ...updateProductDto } = data;

    return await this.productsService.updateProduct(+id, updateProductDto);
  }
}
