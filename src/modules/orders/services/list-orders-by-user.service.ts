import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepositoryInterface } from 'src/@shared/infra/database/repositories/orders-repository.interface';
import { ListOrdersDTO } from '../dto/list-orders.dto';

@Injectable()
export class ListOrdersByUserService {
  constructor(
    @Inject('OrdersRepositoryInterface')
    private readonly ordersRepository: OrdersRepositoryInterface,
  ) {}

  async execute(payload: ListOrdersDTO) {
    const paginated = await this.ordersRepository.findByUserId(payload);
    return paginated;
  }
}
