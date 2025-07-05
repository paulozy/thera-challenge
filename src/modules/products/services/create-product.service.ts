import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ProductsRepositoryInterface } from 'src/@shared/infra/database/repositories/products-repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class CreateProductService {
  constructor(
    @Inject('ProductsRepositoryInterface')
    private readonly productsRepository: ProductsRepositoryInterface,
  ) {}

  async execute(payload: CreateProductDto) {
    const { barcode } = payload;

    let product = await this.productsRepository.findByBarcode(barcode);
    if (product) {
      throw new ConflictException({
        message: `The product with barcode ${barcode} already exists`,
      });
    }

    product = Product.create(payload);
    await this.productsRepository.save(product);

    return product.toJSON();
  }
}
