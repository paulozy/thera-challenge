import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrdersRepositoryInterface } from '@shared/infra/database/repositories/orders-repository.interface';
import {
  PaymentStatus,
  ProcessOrderPaymentDto,
} from '../dto/process-order-payment.dto';
import { Order, OrderStatus } from '../entities/order.entity';

@Injectable()
export class ProcessOrderPaymentService {
  constructor(
    @Inject('OrdersRepositoryInterface')
    private readonly ordersRepository: OrdersRepositoryInterface,
  ) {}

  async execute(input: ProcessOrderPaymentDto): Promise<Order> {
    const order = await this.ordersRepository.findById(input.orderId);

    if (!order) {
      throw new BadRequestException({ message: 'Order not found' });
    }

    if (input.status === PaymentStatus.SUCCEEDED) {
      order.status = OrderStatus.COMPLETED;
    } else {
      order.status = OrderStatus.CANCELED;
    }

    await this.ordersRepository.save(order);

    return order;
  }
}
