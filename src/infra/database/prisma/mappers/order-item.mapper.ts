import { OrderItem as RawOrderItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderItem } from 'src/modules/orders/entities/order.entity';

export class OrderItemMapper {
  static toPersistence(orderItem: OrderItem): RawOrderItem {
    return {
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      priceAtPurchase: new Decimal(orderItem.priceAtPurchase),
      orderId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toDomain(raw: RawOrderItem): OrderItem {
    return {
      productId: raw.productId,
      quantity: raw.quantity,
      priceAtPurchase: raw.priceAtPurchase.toNumber(),
    };
  }
}
