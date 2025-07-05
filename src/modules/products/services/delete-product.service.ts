import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepositoryInterface } from 'src/@shared/infra/database/repositories/products-repository.interface';

@Injectable()
export class DeleteProductService {
  constructor(
    @Inject('ProductsRepositoryInterface')
    private readonly productsRepository: ProductsRepositoryInterface,
  ) {}

  async execute(id: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException({
        message: `Product with ID ${id} not found`,
      });
    }

    await this.productsRepository.delete(id);
  }
}
