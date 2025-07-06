import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { OrdersController } from './orders.controller';
import { CreateOrderService } from './services/create-order.service';
import { ListOrdersByUserService } from './services/list-orders-by-user.service';
import { ProcessOrderPaymentService } from './services/process-order-payment.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [OrdersController],
  providers: [
    CreateOrderService,
    ListOrdersByUserService,
    PrismaService,
    ProcessOrderPaymentService,
  ],
})
export class OrdersModule {}
