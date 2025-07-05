import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepositoryInterface } from 'src/@shared/infra/database/repositories/products-repository.interface';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class UpdateProductService {
  constructor(
    @Inject('ProductsRepositoryInterface')
    private readonly productsRepository: ProductsRepositoryInterface,
  ) {}

  async execute(id: string, payload: UpdateProductDto) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException({
        message: `Product with ID ${id} not found`,
      });
    }

    const updated = Product.create({
      ...product.toJSON(),
      ...payload,
    });

    await this.productsRepository.save(updated);
    return updated.toJSON();
  }
}
