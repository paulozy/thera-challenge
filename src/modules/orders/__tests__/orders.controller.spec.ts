import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus } from '@prisma/client';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ListOrdersDTO } from '../dto/list-orders.dto';
import { OrdersController } from '../orders.controller';
import { CreateOrderService } from '../services/create-order.service';
import { ListOrdersByUserService } from '../services/list-orders-by-user.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let createOrderService: CreateOrderService;
  let listOrdersByUserService: ListOrdersByUserService;

  const mockCreateOrderService = {
    execute: jest.fn(),
  };

  const mockListOrdersByUserService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: CreateOrderService,
          useValue: mockCreateOrderService,
        },
        {
          provide: ListOrdersByUserService,
          useValue: mockListOrdersByUserService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    createOrderService = module.get<CreateOrderService>(CreateOrderService);
    listOrdersByUserService = module.get<ListOrdersByUserService>(
      ListOrdersByUserService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const user = User.create({
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });

      const createOrderDto: CreateOrderDto = {
        userId: 'user1',
        items: [{ id: 'prod1', qty: 1 }],
      };

      const expectedOrder = {
        id: 'order1',
        userId: 'user1',
        total: 10,
        status: OrderStatus.pending,
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateOrderService.execute.mockResolvedValue(expectedOrder);

      const result = await controller.create(user, createOrderDto);

      expect(result).toEqual(expectedOrder);
      expect(createOrderService.execute).toHaveBeenCalledWith({
        ...createOrderDto,
        userId: user.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of orders for the user', async () => {
      const user = User.create({
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });

      const query: ListOrdersDTO = {
        page: 1,
        limit: 10,
      };

      const expectedResponse = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockListOrdersByUserService.execute.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(user, query);

      expect(result).toEqual(expectedResponse);
      expect(listOrdersByUserService.execute).toHaveBeenCalledWith({
        ...query,
        userId: user.id,
      });
    });
  });
});
