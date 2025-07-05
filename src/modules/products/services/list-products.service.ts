import { Inject, Injectable } from '@nestjs/common';
import { ProductsRepositoryInterface } from 'src/@shared/infra/database/repositories/products-repository.interface';
import { ListProductsDTO } from '../dto/list-products.dto';

@Injectable()
export class ListProductsService {
  constructor(
    @Inject('ProductsRepositoryInterface')
    private readonly productsRepository: ProductsRepositoryInterface,
  ) {}

  async execute(payload: ListProductsDTO) {
    const paginated = await this.productsRepository.find(payload);
    return paginated;
  }
}
