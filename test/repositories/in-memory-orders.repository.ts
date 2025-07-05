import { OrdersRepositoryInterface } from 'src/@shared/infra/database/repositories/orders-repository.interface';
import { Paginated } from 'src/@shared/infra/database/repositories/products-repository.interface';
import { ListOrdersDTO } from 'src/modules/orders/dto/list-orders.dto';
import { Order } from 'src/modules/orders/entities/order.entity';

export class InMemoryOrdersRepository implements OrdersRepositoryInterface {
  public orders: Order[] = [];

  async save(order: Order): Promise<void> {
    const index = this.orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
    } else {
      this.orders.push(order);
    }
  }

  async findById(id: string): Promise<Order | undefined> {
    return this.orders.find((order) => order.id === id);
  }

  async findByUserId({
    page = 1,
    limit = 10,
    userId,
  }: ListOrdersDTO): Promise<Paginated<Order>> {
    const userOrders = this.orders.filter((order) => order.userId === userId);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      items: userOrders.slice(startIndex, endIndex),
      total: userOrders.length,
      page,
      limit,
    };
  }
}
