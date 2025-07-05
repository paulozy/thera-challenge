import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsDTO } from './dto/list-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductService } from './services/create-product.service';
import { ListProductsService } from './services/list-products.service';
import { ShowProductService } from './services/show-product.service';
import { UpdateProductService } from './services/update-product.service';
import { DeleteProductService } from './services/delete-product.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly listProductsService: ListProductsService,
    private readonly showProductService: ShowProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.createProductService.execute(payload);
  }

  @Get()
  findAll(@Query() payload: ListProductsDTO) {
    return this.listProductsService.execute(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showProductService.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.updateProductService.execute(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteProductService.execute(id);
  }
}
