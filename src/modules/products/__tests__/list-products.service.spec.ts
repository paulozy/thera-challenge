import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { Product } from '../entities/product.entity';
import { ListProductsService } from '../services/list-products.service';

describe('ListProductsService', () => {
  let service: ListProductsService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProductsService,
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ListProductsService>(ListProductsService);
    productsRepository = module.get<InMemoryProductsRepository>(
      'ProductsRepositoryInterface',
    );

    // Clear repository before each test
    productsRepository.products = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array if no products exist', async () => {
    const result = await service.execute({ page: 1, limit: 10 });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return all products', async () => {
    const product1 = Product.create({
      name: 'Product 1',
      barcode: '001',
      category: 'Cat A',
      description: 'Desc A',
      price: 10,
      stock: 10,
    });
    const product2 = Product.create({
      name: 'Product 2',
      barcode: '002',
      category: 'Cat B',
      description: 'Desc B',
      price: 20,
      stock: 20,
    });
    await productsRepository.save(product1);
    await productsRepository.save(product2);

    const result = await service.execute({ page: 1, limit: 10 });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.items[0].name).toBe('Product 1');
    expect(result.items[1].name).toBe('Product 2');
  });

  it('should return products with pagination', async () => {
    for (let i = 1; i <= 5; i++) {
      await productsRepository.save(
        Product.create({
          name: `Product ${i}`,
          barcode: `00${i}`,
          category: 'Cat',
          description: 'Desc',
          price: i,
          stock: i,
        }),
      );
    }

    const resultPage1 = await service.execute({ page: 1, limit: 2 });
    expect(resultPage1.items).toHaveLength(2);
    expect(resultPage1.total).toBe(5);
    expect(resultPage1.items[0].name).toBe('Product 1');
    expect(resultPage1.items[1].name).toBe('Product 2');

    const resultPage2 = await service.execute({ page: 2, limit: 2 });
    expect(resultPage2.items).toHaveLength(2);
    expect(resultPage2.total).toBe(5);
    expect(resultPage2.items[0].name).toBe('Product 3');
    expect(resultPage2.items[1].name).toBe('Product 4');
  });

  it('should filter products by IDs', async () => {
    const product1 = Product.create({
      name: 'Product 1',
      barcode: '001',
      category: 'Cat A',
      description: 'Desc A',
      price: 10,
      stock: 10,
    });
    const product2 = Product.create({
      name: 'Product 2',
      barcode: '002',
      category: 'Cat B',
      description: 'Desc B',
      price: 20,
      stock: 20,
    });
    const product3 = Product.create({
      name: 'Product 3',
      barcode: '003',
      category: 'Cat C',
      description: 'Desc C',
      price: 30,
      stock: 30,
    });
    await productsRepository.save(product1);
    await productsRepository.save(product2);
    await productsRepository.save(product3);

    const result = await service.execute({
      page: 1,
      limit: 10,
      ids: [product1.id, product3.id],
    });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.items.map((p) => p.id)).toEqual(
      expect.arrayContaining([product1.id, product3.id]),
    );
  });

  it('should filter products by barcodes', async () => {
    const product1 = Product.create({
      name: 'Product 1',
      barcode: '001',
      category: 'Cat A',
      description: 'Desc A',
      price: 10,
      stock: 10,
    });
    const product2 = Product.create({
      name: 'Product 2',
      barcode: '002',
      category: 'Cat B',
      description: 'Desc B',
      price: 20,
      stock: 20,
    });
    const product3 = Product.create({
      name: 'Product 3',
      barcode: '003',
      category: 'Cat C',
      description: 'Desc C',
      price: 30,
      stock: 30,
    });
    await productsRepository.save(product1);
    await productsRepository.save(product2);
    await productsRepository.save(product3);

    const result = await service.execute({
      page: 1,
      limit: 10,
      barcodes: ['001', '003'],
    });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.items.map((p) => p.barcode)).toEqual(
      expect.arrayContaining(['001', '003']),
    );
  });
});
