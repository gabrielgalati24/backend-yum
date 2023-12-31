import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';



import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateShopDto } from './dto/create-shop.dto';


@Controller('api/v1/products')
export class ProductsController {
  constructor(
    @Inject("PRODUCTS_SERVICE") private readonly productsRabbitmq: ClientProxy,
  ) { }

  @Get("")
  getProducts() {
    return this.productsRabbitmq.send({ cmd: "get-products" }, {});
  }


  @Post("create")
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsRabbitmq.send({ cmd: "create-product" }, createProductDto);
  }

  @Post("shop/create")
  createShop(
    @Body() createShopDto: CreateShopDto
  ) {
    return this.productsRabbitmq.send({ cmd: "create-shop" }, createShopDto);
  }

  @Get(":id")
  getProductById(@Param("id") id: number) {
    console.log({ id });

    return this.productsRabbitmq.send({ cmd: "get-product-by-id" }, id);
  }

  @Patch(":id")
  updateProduct(@Param("id") id: number, @Body() updateProductDto: CreateProductDto) {
    return this.productsRabbitmq.send({ cmd: "update-product" }, { id: id, ...updateProductDto });
  }
}
