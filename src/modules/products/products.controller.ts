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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsDTO } from './dto/list-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductService } from './services/create-product.service';
import { DeleteProductService } from './services/delete-product.service';
import { ListProductsService } from './services/list-products.service';
import { ShowProductService } from './services/show-product.service';
import { UpdateProductService } from './services/update-product.service';

@ApiTags('products')
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
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() payload: CreateProductDto) {
    return this.createProductService.execute(payload);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll(@Query() payload: ListProductsDTO) {
    return this.listProductsService.execute(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Show a product' })
  findOne(@Param('id') id: string) {
    return this.showProductService.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.updateProductService.execute(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id') id: string) {
    return this.deleteProductService.execute(id);
  }
}
