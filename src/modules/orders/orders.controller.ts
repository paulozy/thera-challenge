import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/@shared/infra/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as UserEntity } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersDTO } from './dto/list-orders.dto';
import { CreateOrderService } from './services/create-order.service';
import { ListOrdersByUserService } from './services/list-orders-by-user.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly listOrdersByUserService: ListOrdersByUserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() user: UserEntity, @Body() payload: CreateOrderDto) {
    return this.createOrderService.execute({ ...payload, userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User() user: UserEntity, @Query() query: ListOrdersDTO) {
    return this.listOrdersByUserService.execute({ ...query, userId: user.id });
  }
}
