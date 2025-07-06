import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryOrdersRepository } from '../../../../test/repositories/in-memory-orders.repository';
import { Order, OrderStatus } from '../entities/order.entity';
import { ListOrdersByUserService } from '../services/list-orders-by-user.service';

describe('ListOrdersByUserService', () => {
  let service: ListOrdersByUserService;
  let ordersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListOrdersByUserService,
        {
          provide: 'OrdersRepositoryInterface',
          useClass: InMemoryOrdersRepository,
        },
      ],
    }).compile();

    service = module.get<ListOrdersByUserService>(ListOrdersByUserService);
    ordersRepository = module.get<InMemoryOrdersRepository>(
      'OrdersRepositoryInterface',
    );

    ordersRepository.orders = []; // Clear repository before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array if no orders exist for the user', async () => {
    const result = await service.execute({
      userId: 'user-id-1',
      page: 1,
      limit: 10,
    });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return orders for a specific user', async () => {
    const userId = 'user-id-1';
    const order1 = Order.create({
      userId,
      total: 10,
      status: OrderStatus.PENDING,
      products: [],
    });
    const order2 = Order.create({
      userId,
      total: 20,
      status: OrderStatus.COMPLETED,
      products: [],
    });
    const order3 = Order.create({
      userId: 'user-id-2',
      total: 30,
      status: OrderStatus.PENDING,
      products: [],
    });

    await ordersRepository.save(order1);
    await ordersRepository.save(order2);
    await ordersRepository.save(order3);

    const result = await service.execute({ userId, page: 1, limit: 10 });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.items.map((o) => o.id)).toEqual(
      expect.arrayContaining([order1.id, order2.id]),
    );
  });

  it('should return paginated orders for a specific user', async () => {
    const userId = 'user-id-1';
    for (let i = 1; i <= 5; i++) {
      await ordersRepository.save(
        Order.create({
          userId,
          total: i * 10,
          status: OrderStatus.PENDING,
          products: [],
        }),
      );
    }

    const resultPage1 = await service.execute({ userId, page: 1, limit: 2 });
    expect(resultPage1.items).toHaveLength(2);
    expect(resultPage1.total).toBe(5);

    const resultPage2 = await service.execute({ userId, page: 2, limit: 2 });
    expect(resultPage2.items).toHaveLength(2);
    expect(resultPage2.total).toBe(5);
  });
});
