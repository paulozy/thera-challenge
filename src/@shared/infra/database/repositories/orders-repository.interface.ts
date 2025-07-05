import { ListOrdersDTO } from 'src/modules/orders/dto/list-orders.dto';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Paginated } from './products-repository.interface';

export interface OrdersRepositoryInterface {
  findByUserId(payload: ListOrdersDTO): Promise<Paginated<Order>>;
  findById(id: string): Promise<Order | undefined>;
  save(order: Order): Promise<void>;
}
