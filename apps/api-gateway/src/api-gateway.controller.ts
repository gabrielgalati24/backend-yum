import { Controller, Get, Inject } from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";
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
