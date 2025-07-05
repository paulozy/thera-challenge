import {
  OrderStatus as PrismaOrderStatus,
  Order as RawOrder,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Order, OrderStatus } from 'src/modules/orders/entities/order.entity';
import { OrderItemMapper } from './order-item.mapper';

export class OrderMapper {
  static toPersistence(order: Order): RawOrder {
    return {
      id: order.id,
      userId: order.userId,
      total: new Decimal(order.total),
      status: order.status as PrismaOrderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toDomain(raw: RawOrder & { products?: any[] }): Order {
    return Order.create({
      id: raw.id,
      userId: raw.userId,
      products: raw.products ? raw.products.map(OrderItemMapper.toDomain) : [],
      total: raw.total.toNumber(),
      status: raw.status as OrderStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
