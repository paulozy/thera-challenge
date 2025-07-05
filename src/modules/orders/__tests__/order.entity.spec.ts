import { Order, OrderStatus } from '../entities/order.entity';

describe('Order Entity', () => {
  it('should be able to create an order', () => {
    const order = Order.create({
      userId: 'user-id-1',
      total: 100.50,
      status: OrderStatus.PENDING,
      products: [],
    });

    expect(order).toBeInstanceOf(Order);
    expect(order.userId).toBe('user-id-1');
    expect(order.total).toBe(100.50);
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.products).toEqual([]);
    expect(order.id).toBeDefined();
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('should return a JSON representation', () => {
    const order = Order.create({
      userId: 'user-id-1',
      total: 100.50,
      status: OrderStatus.PENDING,
      products: [],
    });

    const orderJson = order.toJSON();

    expect(orderJson).toEqual({
      id: order.id,
      userId: order.userId,
      products: order.products,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  });
});
