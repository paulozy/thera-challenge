import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { Product } from '../entities/product.entity';
import { ShowProductService } from '../services/show-product.service';

describe('ShowProductService', () => {
  let service: ShowProductService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowProductService,
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ShowProductService>(ShowProductService);
    productsRepository = module.get<InMemoryProductsRepository>('ProductsRepositoryInterface');

    // Clear repository before each test
    productsRepository.products = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a product if it exists', async () => {
    const product = Product.create({
      name: 'Test Product',
      barcode: '12345',
      category: 'Category',
      description: 'Description',
      price: 10,
      stock: 10,
    });
    await productsRepository.save(product);

    const result = await service.execute(product.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(product.id);
    expect(result.name).toBe(product.name);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(service.execute(nonExistentId)).rejects.toThrow(NotFoundException);
    await expect(service.execute(nonExistentId)).rejects.toThrow(
      `Product with ID ${nonExistentId} not found`,
    );
  });
});
