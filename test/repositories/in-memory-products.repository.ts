import {
  Paginated,
  ProductsRepositoryInterface,
} from 'src/@shared/infra/database/repositories/products-repository.interface';
import { ListProductsDTO } from 'src/modules/products/dto/list-products.dto';
import { Product } from 'src/modules/products/entities/product.entity';

export class InMemoryProductsRepository implements ProductsRepositoryInterface {
  public products: Product[] = [];

  async findById(id: string): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  async findByBarcode(barcode: string): Promise<Product | undefined> {
    return this.products.find((product) => product.barcode === barcode);
  }

  async find(payload: ListProductsDTO): Promise<Paginated<Product>> {
    let filteredProducts = this.products;

    if (payload.ids && payload.ids.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        payload.ids!.includes(product.id),
      );
    }

    if (payload.barcodes && payload.barcodes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        payload.barcodes!.includes(product.barcode),
      );
    }

    const page = payload?.page || 1;
    const limit = payload?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      items: filteredProducts.slice(startIndex, endIndex),
      total: filteredProducts.length,
      page,
      limit,
    };
  }

  async save(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    } else {
      this.products.push(product);
    }
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((product) => product.id !== id);
  }
}
