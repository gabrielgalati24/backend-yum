import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { RedisCacheService } from '../../../common/services/redis-cache.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private readonly cache: RedisCacheService) { }

  async getProducts(): Promise<any> {
    try {

      let products = await this.cache.get('products');
      if (!products) {
        products = await this.prisma.product.findMany();
        await this.cache.set('products', products);
      }
      return products;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudieron obtener los productos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createProduct(createProductDto): Promise<any> {
    try {
      const { name, price } = createProductDto;
      const product = await this.prisma.product.create({
        data: {
          name,
          price
        }
      });
      // Invalidate the cache after a product is created
      await this.cache.del('products');
      return product;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudo crear el producto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductById(id): Promise<any> {
    try {
      let product = await this.cache.get(`product:${id}`);
      if (!product) {
        product = await this.prisma.product.findUnique({
          where: {
            id: +id
          }
        });
        await this.cache.set(`product:${id}`, product);
      }
      return product;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudo obtener el producto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProduct(id, updateProductDto: CreateProductDto): Promise<any> {
    try {
      const { name, price } = updateProductDto;
      const product = await this.prisma.product.update({
        where: {
          id: +id
        },
        data: {
          name,
          price
        }
      });

      await this.cache.del('products');
      await this.cache.del(`product:${id}`);
      return product;
    } catch (error) {
      console.error(error);
      throw new HttpException('No se pudo actualizar el producto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
