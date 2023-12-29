import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";
import { CreateProductDto } from "apps/products/dto/create-product.dto";
import { CreateShopDto } from "apps/products/dto/create-shop.dto";
import { HttpExceptionFilter } from "common/utils/httpError";
import { interval, firstValueFrom } from "rxjs";
@Controller()
export class ApiGatewayController {
  constructor(
    @Inject("PRODUCTS_SERVICE") private readonly productsRabbitmq: ClientProxy,
  ) { }

  @Get("products")
  getProducts() {
    return this.productsRabbitmq.send({ cmd: "get-products" }, {});
  }


  @Post("products/create")
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

  @Get("products/:id")
  getProductById(@Param("id") id: number) {
    console.log({ id });

    return this.productsRabbitmq.send({ cmd: "get-product-by-id" }, id);
  }

  @Patch("products/:id")
  updateProduct(@Param("id") id: number, @Body() updateProductDto: CreateProductDto) {
    return this.productsRabbitmq.send({ cmd: "update-product" }, { id: id, ...updateProductDto });
  }
}



// import { Controller, Get, Inject } from "@nestjs/common";

// import { ClientProxy } from "@nestjs/microservices";
// import { interval, firstValueFrom } from "rxjs";
// @Controller()
// export class ApiGatewayController {
//   constructor(
//     @Inject("PRODUCTS_SERVICE") private readonly productsRabbitmq: ClientProxy,
//   ) { }

//   @Get("products")
//   async getProducts() {
//     const pattern = { cmd: "get-products" };
//     const payload = {};
//     const products = await firstValueFrom(
//       this.productsRabbitmq.send(pattern, payload),
//     );
//     return products;
//   }
// }
