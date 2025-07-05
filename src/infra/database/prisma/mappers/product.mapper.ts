import { Product as RawProduct } from '@prisma/client';
import { Product } from 'src/modules/products/entities/product.entity';

export class ProductMapper {
  static toPersistence(product: Product): RawProduct {
    return {
      id: product.id,
      barcode: product.barcode,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  static toDomain(raw: RawProduct): Product {
    return Product.create({
      id: raw.id,
      barcode: raw.barcode,
      name: raw.name,
      category: raw.category,
      description: raw.description,
      price: raw.price,
      stock: raw.stock,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }
}
