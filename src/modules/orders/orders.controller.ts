import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/@shared/infra/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as UserEntity } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersDTO } from './dto/list-orders.dto';
import { ProcessOrderPaymentDto } from './dto/process-order-payment.dto';
import { CreateOrderService } from './services/create-order.service';
import { ListOrdersByUserService } from './services/list-orders-by-user.service';
import { ProcessOrderPaymentService } from './services/process-order-payment.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly listOrdersByUserService: ListOrdersByUserService,
    private readonly processOrderPaymentService: ProcessOrderPaymentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@User() user: UserEntity, @Body() payload: CreateOrderDto) {
    return this.createOrderService.execute({ ...payload, userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'List all orders by user' })
  findAll(@User() user: UserEntity, @Query() query: ListOrdersDTO) {
    return this.listOrdersByUserService.execute({ ...query, userId: user.id });
  }

  @Patch(':id/payment')
  @ApiOperation({ summary: 'Process order payment' })
  update(
    @Param('id') id: string,
    @Body() payload: Omit<ProcessOrderPaymentDto, 'orderId'>,
  ) {
    return this.processOrderPaymentService.execute({
      orderId: id,
      status: payload.status,
    });
  }
}
