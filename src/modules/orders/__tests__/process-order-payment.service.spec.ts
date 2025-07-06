import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryOrdersRepository } from '../../../../test/repositories/in-memory-orders.repository';
import { OrdersRepositoryInterface } from '@shared/infra/database/repositories/orders-repository.interface';
import { ProcessOrderPaymentService } from '../services/process-order-payment.service';
import {
  Order,
  OrderStatus,
  PaymentStatus,
} from '../entities/order.entity';
import { randomUUID } from 'crypto';

describe('ProcessOrderPaymentService', () => {
  let service: ProcessOrderPaymentService;
  let ordersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessOrderPaymentService,
        {
          provide: 'OrdersRepositoryInterface',
          useClass: InMemoryOrdersRepository,
        },
      ],
    }).compile();

    service = module.get<ProcessOrderPaymentService>(
      ProcessOrderPaymentService,
    );
    ordersRepository = module.get<OrdersRepositoryInterface>(
      'OrdersRepositoryInterface',
    ) as InMemoryOrdersRepository;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if order does not exist', async () => {
    await expect(
      service.execute({
        orderId: 'invalid-id',
        status: PaymentStatus.SUCCEEDED,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update order status to completed when payment is succeeded', async () => {
    const order = Order.create({
      id: randomUUID(),
      userId: randomUUID(),
      total: 100,
      status: OrderStatus.PENDING,
      products: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await ordersRepository.save(order);

    const updatedOrder = await service.execute({
      orderId: order.id,
      status: PaymentStatus.SUCCEEDED,
    });

    expect(updatedOrder.status).toEqual(OrderStatus.COMPLETED);
  });

  it('should update order status to canceled when payment is canceled', async () => {
    const order = Order.create({
      id: randomUUID(),
      userId: randomUUID(),
      total: 100,
      status: OrderStatus.PENDING,
      products: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await ordersRepository.save(order);

    const updatedOrder = await service.execute({
      orderId: order.id,
      status: PaymentStatus.CANCELED,
    });

    expect(updatedOrder.status).toEqual(OrderStatus.CANCELED);
  });
});
