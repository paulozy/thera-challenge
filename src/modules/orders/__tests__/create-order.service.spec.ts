import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Product } from 'src/modules/products/entities/product.entity';
import { InMemoryProductsRepository } from '../../../../test/repositories/in-memory-products.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CreateOrderService } from '../services/create-order.service';

describe('CreateOrderService', () => {
  let service: CreateOrderService;
  let prisma: PrismaService;
  let productsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            product: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            order: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: 'ProductsRepositoryInterface',
          useClass: InMemoryProductsRepository,
        },
      ],
    }).compile();

    service = module.get<CreateOrderService>(CreateOrderService);
    prisma = module.get<PrismaService>(PrismaService);
    productsRepository = module.get<InMemoryProductsRepository>(
      'ProductsRepositoryInterface',
    );
  });

  it('should create an order successfully', async () => {
    const product = Product.create({
      name: 'Product 1',
      barcode: '001',
      category: 'Any',
      description: 'Description',
      price: 100,
      stock: 10,
    });

    await productsRepository.save(product);

    const dto: CreateOrderDto = {
      userId: 'user-1',
      items: [{ id: product.id, qty: 2 }],
    };

    const fakeOrderId = 'order-1';
    const orderCreateMock = {
      id: fakeOrderId,
      userId: dto.userId,
      total: new Prisma.Decimal(200),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      products: [
        {
          productId: product.id,
          quantity: 2,
          priceAtPurchase: 100,
        },
      ],
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
      cb({
        product: {
          findUnique: jest.fn().mockResolvedValue({
            id: product.id,
            stock: product.stock,
            price: product.price,
          }),
          update: jest.fn(),
        },
        order: {
          create: jest.fn().mockResolvedValue(orderCreateMock),
        },
      }),
    );

    const result = await service.execute(dto);

    expect(result).toMatchObject({
      id: fakeOrderId,
      userId: dto.userId,
      total: 200,
      products: [
        {
          productId: product.id,
          quantity: 2,
          priceAtPurchase: 100,
        },
      ],
    });
  });

  it('should throw if user is not logged in', async () => {
    await expect(
      service.execute({
        userId: '',
        items: [],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if product not found', async () => {
    const dto: CreateOrderDto = {
      userId: 'user-1',
      items: [{ id: 'non-existent-id', qty: 1 }],
    };

    await expect(service.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw if product has insufficient stock', async () => {
    const product = Product.create({
      name: 'Product 2',
      barcode: '001',
      category: 'Any',
      description: 'Description',
      price: 50,
      stock: 1,
    });

    await productsRepository.save(product);

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
      cb({
        product: {
          findUnique: jest.fn().mockResolvedValue({
            id: product.id,
            stock: 1,
            price: 50,
          }),
        },
        order: {
          create: jest.fn(),
        },
      }),
    );

    const dto: CreateOrderDto = {
      userId: 'user-1',
      items: [{ id: product.id, qty: 5 }],
    };

    await expect(service.execute(dto)).rejects.toThrow(BadRequestException);
  });
});
