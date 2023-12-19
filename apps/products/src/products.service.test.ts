import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { RedisCacheService } from '../../../common/services/redis-cache.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prismaService: PrismaService;
  let cacheService: RedisCacheService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: RedisCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    productsService = app.get<ProductsService>(ProductsService);
    prismaService = app.get<PrismaService>(PrismaService);
    cacheService = app.get<RedisCacheService>(RedisCacheService);
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products: any = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(products);
      jest.spyOn(cacheService, 'set').mockResolvedValue(null);

      const result = await productsService.getProducts();

      expect(result).toEqual(products);
      expect(cacheService.get).toHaveBeenCalledWith('products');
      expect(prismaService.product.findMany).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith('products', products);
    });

    it('should throw an error if products cannot be obtained', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockRejectedValue(new Error('Database error'));

      await expect(productsService.getProducts()).rejects.toThrow(
        HttpException,
      );
      expect(cacheService.get).toHaveBeenCalledWith('products');
      expect(prismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: any = { name: 'New Product', price: 10 };
      const createdProduct: any = { id: 1, name: 'New Product', price: 10 };
      jest
        .spyOn(prismaService.product, 'create')
        .mockResolvedValue(createdProduct);
      jest.spyOn(cacheService, 'del').mockResolvedValue(null);

      const result = await productsService.createProduct(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
        },
      });
      expect(cacheService.del).toHaveBeenCalledWith('products');
    });

    it('should throw an error if product cannot be created', async () => {
      const createProductDto = { name: 'New Product', price: 10 };
      jest
        .spyOn(prismaService.product, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        productsService.createProduct(createProductDto),
      ).rejects.toThrow(HttpException);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
        },
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const id = 1;
      const product: any = { id: 1, name: 'Product 1', price: 10 };
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(product);
      jest.spyOn(cacheService, 'set').mockResolvedValue(null);

      const result = await productsService.getProductById(id);

      expect(result).toEqual(product);
      expect(cacheService.get).toHaveBeenCalledWith(`product:${id}`);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
        },
      });
      expect(cacheService.set).toHaveBeenCalledWith(`product:${id}`, product);
    });

    it('should throw an error if product cannot be obtained', async () => {
      const id = 1;
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      await expect(productsService.getProductById(id)).rejects.toThrow(
        HttpException,
      );
      expect(cacheService.get).toHaveBeenCalledWith(`product:${id}`);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
        },
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const id = 1;
      const updateProductDto: any = { name: 'Updated Product', price: 20 };
      const updatedProduct: any = { id: 1, name: 'Updated Product', price: 20 };
      jest
        .spyOn(prismaService.product, 'update')
        .mockResolvedValue(updatedProduct);
      jest.spyOn(cacheService, 'del').mockResolvedValue(null);

      const result = await productsService.updateProduct(id, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: {
          id: id,
        },
        data: {
          name: updateProductDto.name,
          price: updateProductDto.price,
        },
      });
      expect(cacheService.del).toHaveBeenCalledWith('products');
      expect(cacheService.del).toHaveBeenCalledWith(`product:${id}`);
    });

    it('should throw an error if product cannot be updated', async () => {
      const id = 1;
      const updateProductDto = { name: 'Updated Product', price: 20 };
      jest
        .spyOn(prismaService.product, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        productsService.updateProduct(id, updateProductDto),
      ).rejects.toThrow(HttpException);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: {
          id: id,
        },
        data: {
          name: updateProductDto.name,
          price: updateProductDto.price,
        },
      });
    });
  });
});
