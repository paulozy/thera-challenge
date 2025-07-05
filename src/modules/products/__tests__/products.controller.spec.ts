import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsController } from '../products.controller';
import { CreateProductService } from '../services/create-product.service';
import { DeleteProductService } from '../services/delete-product.service';
import { ListProductsService } from '../services/list-products.service';
import { ShowProductService } from '../services/show-product.service';
import { UpdateProductService } from '../services/update-product.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let createProductService: CreateProductService;
  let listProductsService: ListProductsService;
  let showProductService: ShowProductService;
  let updateProductService: UpdateProductService;
  let deleteProductService: DeleteProductService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        CreateProductService,
        ListProductsService,
        ShowProductService,
        UpdateProductService,
        DeleteProductService,
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    createProductService =
      module.get<CreateProductService>(CreateProductService);
    listProductsService = module.get<ListProductsService>(ListProductsService);
    showProductService = module.get<ShowProductService>(ShowProductService);
    updateProductService =
      module.get<UpdateProductService>(UpdateProductService);
    deleteProductService =
      module.get<DeleteProductService>(DeleteProductService);
    productsRepository = module.get<InMemoryProductsRepository>(
      'ProductsRepositoryInterface',
    );

    productsRepository.products = []; // Clear repository before each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        barcode: '12345',
        category: 'Electronics',
        description: 'A test product',
        price: 100,
        stock: 10,
      };
      const result = await controller.create(createProductDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createProductDto.name);
      expect(productsRepository.products).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const product = Product.create({
        name: 'Test',
        barcode: '001',
        category: 'Cat',
        description: 'Desc',
        price: 10,
        stock: 10,
      });
      await productsRepository.save(product);
      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Test');
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const product = Product.create({
        name: 'Test',
        barcode: '001',
        category: 'Cat',
        description: 'Desc',
        price: 10,
        stock: 10,
      });
      await productsRepository.save(product);
      const result = await controller.findOne(product.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(product.id);
    });

    it('should throw NotFoundException if product not found', async () => {
      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const product = Product.create({
        name: 'Old Name',
        barcode: '001',
        category: 'Cat',
        description: 'Desc',
        price: 10,
        stock: 10,
      });
      await productsRepository.save(product);
      const updateDto = { name: 'New Name', price: 20 };
      const result = await controller.update(product.id, updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe('New Name');
      expect(productsRepository.products[0].name).toBe('New Name');
    });

    it('should throw NotFoundException if product not found', async () => {
      const updateDto = { name: 'New Name', price: 20 };
      await expect(
        controller.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = Product.create({
        name: 'Test',
        barcode: '001',
        category: 'Cat',
        description: 'Desc',
        price: 10,
        stock: 10,
      });
      await productsRepository.save(product);
      await controller.remove(product.id);
      expect(productsRepository.products).toHaveLength(0);
    });

    it('should throw NotFoundException if product not found', async () => {
      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
