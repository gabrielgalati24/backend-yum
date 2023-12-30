import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';


@Module({
  imports: [

    ProductsController
  ],


})
export class ProductsModule { }
