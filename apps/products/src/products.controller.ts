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
import { RabbitMqService } from "common/utils/rmq.service";
import { HttpExceptionFilter } from "common/utils/httpError";
import { RpcExceptionFilter } from "common/utils/rcpError";
@Controller("api")
@UseFilters(new RpcExceptionFilter())
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject("PRODUCTS_SERVICE") private readonly RabbitMqService: RabbitMqService,
  ) { }

  @MessagePattern({ cmd: 'get-products' })
  async getProducts(@Ctx() context: RmqContext) {

    this.RabbitMqService.acknowledgeMessage(context);

    return await this.productsService.getProducts();
  }

  @MessagePattern({ cmd: 'create-product' })
  async createProduct(@Ctx() context: RmqContext, @Payload() createProductDto: CreateProductDto) {
    this.RabbitMqService.acknowledgeMessage(context);
    console.log({ createProductDto });
    return await this.productsService.createProduct(createProductDto);
  }


  // @Post("/v1/shop/create")
  @MessagePattern({ cmd: 'create-shop' })
  async createShop(@Payload() createShopDto: CreateShopDto) {
    console.log({ createShopDto });
    return await this.productsService.createShop(createShopDto);
  }
  // @Get("/v1/products/:id")
  @MessagePattern({ cmd: 'get-product-by-id' })
  async getProductById(@Ctx() context: RmqContext, @Payload() id: number) {
    console.log({ id });
    this.RabbitMqService.acknowledgeMessage(context);
    console.log("getProductById");
    return await this.productsService.getProductById(+id);
  }

  // @Patch("/v1/products/:id")
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
