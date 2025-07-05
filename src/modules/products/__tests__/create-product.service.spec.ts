import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { CreateProductService } from '../services/create-product.service';
import { Product } from '../entities/product.entity';

describe('CreateProductService', () => {
  let service: CreateProductService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductService,
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    service = module.get<CreateProductService>(CreateProductService);
    productsRepository = module.get<InMemoryProductsRepository>('ProductsRepositoryInterface');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new product successfully', async () => {
    const payload = {
      name: 'Test Product',
      barcode: '1234567890',
      category: 'Electronics',
      description: 'A test product',
      price: 100.00,
      stock: 10,
    };

    const result = await service.execute(payload);

    expect(result).toBeDefined();
    expect(result.name).toBe(payload.name);
    expect(result.barcode).toBe(payload.barcode);
    expect(productsRepository.products.length).toBe(1);
    expect(productsRepository.products[0].name).toBe(payload.name);
  });

  it('should throw ConflictException if product with barcode already exists', async () => {
    const payload = {
      name: 'Existing Product',
      barcode: 'existing-barcode',
      category: 'Books',
      description: 'An existing product',
      price: 50.00,
      stock: 5,
    };

    await productsRepository.save(Product.create(payload));

    await expect(service.execute(payload)).rejects.toThrow(ConflictException);
    await expect(service.execute(payload)).rejects.toThrow(
      `The product with barcode ${payload.barcode} already exists`,
    );
  });
});
