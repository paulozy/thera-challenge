import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ProductsController } from './products.controller';
import { CreateProductService } from './services/create-product.service';
import { DeleteProductService } from './services/delete-product.service';
import { ListProductsService } from './services/list-products.service';
import { ShowProductService } from './services/show-product.service';
import { UpdateProductService } from './services/update-product.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    CreateProductService,
    ListProductsService,
    ShowProductService,
    UpdateProductService,
    DeleteProductService,
  ],
})
export class ProductsModule {}
