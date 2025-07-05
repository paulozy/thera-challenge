import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { Product } from '../entities/product.entity';
import { UpdateProductService } from '../services/update-product.service';

describe('UpdateProductService', () => {
  let service: UpdateProductService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductService,
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateProductService>(UpdateProductService);
    productsRepository = module.get<InMemoryProductsRepository>('ProductsRepositoryInterface');

    // Clear repository before each test
    productsRepository.products = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a product successfully', async () => {
    const product = Product.create({
      name: 'Old Name',
      barcode: '123',
      category: 'Cat',
      description: 'Desc',
      price: 10,
      stock: 10,
    });
    await productsRepository.save(product);

    const updatePayload = {
      name: 'New Name',
      price: 20,
      stock: 5,
    };

    const result = await service.execute(product.id, updatePayload);

    expect(result).toBeDefined();
    expect(result.id).toBe(product.id);
    expect(result.name).toBe(updatePayload.name);
    expect(result.price).toBe(updatePayload.price);
    expect(result.stock).toBe(updatePayload.stock);
    expect(productsRepository.products[0].name).toBe(updatePayload.name);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    const nonExistentId = 'non-existent-id';
    const updatePayload = {
      name: 'New Name',
      price: 20,
      stock: 5,
    };

    await expect(service.execute(nonExistentId, updatePayload)).rejects.toThrow(NotFoundException);
    await expect(service.execute(nonExistentId, updatePayload)).rejects.toThrow(
      `Product with ID ${nonExistentId} not found`,
    );
  });
});
