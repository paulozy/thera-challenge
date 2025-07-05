import { Injectable } from '@nestjs/common';
import { OrdersRepositoryInterface } from 'src/@shared/infra/database/repositories/orders-repository.interface';
import { Paginated } from 'src/@shared/infra/database/repositories/products-repository.interface';
import { ListOrdersDTO } from 'src/modules/orders/dto/list-orders.dto';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | undefined> {
    const rawData = await this.prisma.order.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!rawData) {
      return undefined;
    }

    return OrderMapper.toDomain(rawData);
  }

  async findByUserId(payload: ListOrdersDTO): Promise<Paginated<Order>> {
    const { page = 1, limit = 10, userId } = payload;
    const skip = (page - 1) * limit;

    const filter = {
      userId: userId,
    };

    const [total, rawData] = await Promise.all([
      this.prisma.order.count({ where: filter }),
      this.prisma.order.findMany({
        where: filter,
        skip,
        take: limit,
        include: { products: true },
      }),
    ]);

    return {
      items: rawData.map(OrderMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async save(order: Order): Promise<void> {
    throw new Error('Method not implemented');
  }
}
