import { HttpException, HttpStatus, Injectable, UseFilters } from "@nestjs/common";
import { PrismaService } from "../../../common/database/prisma.service";
import { CreateProductDto } from "../dto/create-product.dto";
import { RedisCacheService } from "../../../common/services/redis-cache.service";
import { RpcException } from '@nestjs/microservices';

@Injectable()

export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) { }

  async getProducts() {
    try {
      // const x = this.prisma.shop.findMany();
      // console.log(x);
      console.log("getProducts");
      let products = await this.cache.get("products");
      if (!products) {
        products = await this.prisma.product.findMany({
          include: {
            shop: true,
          },
        });
        await this.cache.set("products", products);
      }
      return products;
    } catch (error) {
      console.error(error);
      throw new RpcException({
        message: 'No se pudo obtener los productos',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      });
    }
  }

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const { name, price, shopId = 1 } = createProductDto;
      console.log({ name, price, shopId });
      const product = await this.prisma.product.create({
        data: {
          name,
          price,
          shopId,
        },
      });
      // Invalidate the cache after a product is created
      await this.cache.del("products");
      return product;
    } catch (error) {
      console.error(error);

      if (error.code === "P2003") {
        throw new RpcException({
          message: "La tienda no existe",
          statusCode: HttpStatus.NOT_FOUND,
          error: error.message,
        });
      }
      throw new RpcException({
        message: 'No se pudo crear el producto',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      });
    }
  }

  async getProductById(id: number) {
    try {
      let product = await this.cache.get(`product:${id}`);
      if (!product) {
        product = await this.prisma.product.findUnique({
          where: {
            id: +id,
          },
        });
        await this.cache.set(`product:${id}`, product);
      }
      return product;
    } catch (error) {
      console.error(error);
      throw new RpcException({
        message: 'No se pudo obtener el producto',
        statusCode: 500,
        error: error.message,
      }

      );
    }
  }

  async updateProduct(id: number, updateProductDto: CreateProductDto) {
    try {
      const { name, price } = updateProductDto;
      const product = await this.prisma.product.update({
        where: {
          id: +id,
        },
        data: {
          name,
          price,
        },
      });

      await this.cache.del("products");
      await this.cache.del(`product:${id}`);
      return product;
    } catch (error) {
      console.error(error);
      throw new RpcException({
        message: 'No se pudo actualizar el producto',
        statusCode: 500,
        error: error.message,
      });
    }
  }
  async createShop(createProductDto: any) {
    try {
      const { name = "test" } = createProductDto;
      const product = await this.prisma.shop.create({
        data: {
          name,
        },
      });
      // Invalidate the cache after a product is created
      await this.cache.del("products");
      return product;
    } catch (error) {
      console.error(error);
      throw new RpcException({
        message: 'No se pudo crear la tienda',
        statusCode: 500,
        error: error.message,
      });
    }
  }
}
