import { Injectable } from '@nestjs/common';
import {
  Paginated,
  ProductsRepositoryInterface,
} from 'src/@shared/infra/database/repositories/products-repository.interface';
import { ListProductsDTO } from 'src/modules/products/dto/list-products.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaProductsRepository implements ProductsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | undefined> {
    const rawData = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!rawData) {
      return undefined;
    }

    return ProductMapper.toDomain(rawData);
  }

  async findByBarcode(barcode: string): Promise<Product | undefined> {
    const rawData = await this.prisma.product.findUnique({
      where: { barcode },
    });

    if (!rawData) {
      return undefined;
    }

    return ProductMapper.toDomain(rawData);
  }

  async find(payload: ListProductsDTO): Promise<Paginated<Product>> {
    const { page = 1, limit = 10 } = payload;
    const skip = (page - 1) * limit;

    const [total, rawData] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.findMany({
        skip,
        take: limit,
      }),
    ]);

    return {
      items: rawData.map(ProductMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async save(product: Product): Promise<void> {
    const rawData = ProductMapper.toPersistence(product);

    await this.prisma.product.upsert({
      where: { id: rawData.id || '' },
      update: rawData,
      create: rawData,
    });

    return;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });

    return;
  }
}
