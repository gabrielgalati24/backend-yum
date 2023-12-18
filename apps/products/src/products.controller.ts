import { Body, Controller, Get, Inject, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateShopDto } from '../dto/create-shop.dto';
@Controller("api")
export class ProductsController {
  constructor(private readonly productsService: ProductsService, @Inject('AUTH_CLIENT') private readonly client: ClientProxy) { }

  @Get("/v1/products")
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Post("/v1/products/create")
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductDto);
  }
  @Post("/v1/shop/create")
  async createShop(@Body() createShopDto: CreateShopDto) {
    return await this.productsService.createShop(createShopDto);
  }
  @Get("/v1/products/:id")
  async getProductById(@Param('id') id: number) {
    return await this.productsService.getProductById(+id);
  }

  @Patch("/v1/products/:id")
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: CreateProductDto) {
    return await this.productsService.updateProduct(+id, updateProductDto);
  }


}
