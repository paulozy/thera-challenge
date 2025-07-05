import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { Product } from '../entities/product.entity';
import { DeleteProductService } from '../services/delete-product.service';

describe('DeleteProductService', () => {
  let service: DeleteProductService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductService,
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteProductService>(DeleteProductService);
    productsRepository = module.get<InMemoryProductsRepository>('ProductsRepositoryInterface');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a product successfully', async () => {
    const product = Product.create({
      name: 'Test Product',
      barcode: '12345',
      category: 'Category',
      description: 'Description',
      price: 10,
      stock: 10,
    });
    await productsRepository.save(product);

    await service.execute(product.id);

    const foundProduct = await productsRepository.findById(product.id);
    expect(foundProduct).toBeUndefined();
  });

  it('should throw NotFoundException if product does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(service.execute(nonExistentId)).rejects.toThrow(NotFoundException);
    await expect(service.execute(nonExistentId)).rejects.toThrow(
      `Product with ID ${nonExistentId} not found`,
    );
  });
});
