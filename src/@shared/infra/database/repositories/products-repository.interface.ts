import { ListProductsDTO } from 'src/modules/products/dto/list-products.dto';
import { Product } from 'src/modules/products/entities/product.entity';

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export interface ProductsRepositoryInterface {
  find(payload: ListProductsDTO): Promise<Paginated<Product>>;
  findById(id: string): Promise<Product | undefined>;
  findByBarcode(barcode: string): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}
