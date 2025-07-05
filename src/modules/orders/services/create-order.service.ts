import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsRepositoryInterface } from 'src/@shared/infra/database/repositories/products-repository.interface';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Product } from 'src/modules/products/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order, OrderItem, OrderStatus } from '../entities/order.entity';

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ProductsRepositoryInterface')
    private readonly productsRepository: ProductsRepositoryInterface,
  ) {}

  async execute(payload: CreateOrderDto) {
    const { items, userId } = payload;

    if (!userId) {
      throw new BadRequestException({ message: 'User is not logged' });
    }

    const { items: products } = await this.productsRepository.find({
      page: 1,
      limit: items.length,
      ids: items.map((i) => i.id),
    });

    if (products.length !== items.length) {
      const foundedProducts = new Set<string>(
        products.map((product) => product.id),
      );
      const missingProducts = items.filter(
        (item) => !foundedProducts.has(item.id),
      );

      if (missingProducts.length) {
        throw new BadRequestException({
          message: 'Products not found',
          missing: `${missingProducts.map((mp) => mp.id).join(', ')}`,
        });
      }
    }

    try {
      const createdOrderRecord = await this.prisma.$transaction(
        async (transactional) => {
          const productsMap = new Map<string, Product>();
          products.forEach((p) => productsMap.set(p.id, p));

          let calculatedTotal = 0;
          const productsToUpdateInDb: { id: string; stock: number }[] = [];
          const orderItems: OrderItem[] = [];

          for (const item of items) {
            const product = productsMap.get(item.id);

            if (!product) {
              throw new BadRequestException(
                `Product with ID ${item.id} not found.`,
              );
            }

            const productFromDB = await transactional.product.findUnique({
              where: { id: product.id },
              select: { id: true, stock: true, price: true },
            });

            if (!productFromDB || item.qty > productFromDB.stock) {
              throw new BadRequestException({
                message: `The product ${item.id} has not enough stock. Available: ${productFromDB?.stock || 0}, Requested: ${item.qty}`,
              });
            }

            const newStock = productFromDB.stock - item.qty;
            productsToUpdateInDb.push({
              id: productFromDB.id,
              stock: newStock,
            });

            calculatedTotal += productFromDB.price * item.qty;
            orderItems.push({
              productId: productFromDB.id,
              quantity: item.qty,
              priceAtPurchase: productFromDB.price,
            });
          }

          const order = Order.create({
            userId,
            products: orderItems,
            total: calculatedTotal,
          });

          const orderRecord = await transactional.order.create({
            data: {
              ...order.toJSON(),
              status: OrderStatus.PENDING,
              products: {
                createMany: {
                  data: orderItems,
                },
              },
            },
            include: {
              products: true,
            },
          });

          const updateProductPromises = productsToUpdateInDb.map((p) =>
            transactional.product.update({
              where: { id: p.id },
              data: { stock: p.stock },
            }),
          );
          await Promise.all(updateProductPromises);

          const finalOrderEntity = Order.create({
            id: orderRecord.id,
            userId: orderRecord.userId,
            products: orderItems,
            total: orderRecord.total.toNumber(),
            status: orderRecord.status as OrderStatus,
            createdAt: orderRecord.createdAt,
            updatedAt: orderRecord.updatedAt,
          });

          return finalOrderEntity.toJSON();
        },
        {
          maxWait: 5000,
          timeout: 10000,
        },
      );

      return createdOrderRecord;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('A unique constraint failed.');
        }
      }
      console.error('Error on order transaction:', error);
      throw error;
    }
  }
}
