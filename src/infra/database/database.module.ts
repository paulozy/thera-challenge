import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders.repository';
import { PrismaProductsRepository } from './prisma/repositories/prisma-products.repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: PrismaUsersRepository,
    },
    {
      provide: 'ProductsRepositoryInterface',
      useClass: PrismaProductsRepository,
    },
    {
      provide: 'OrdersRepositoryInterface',
      useClass: PrismaOrdersRepository,
    },
  ],
  exports: [
    'UsersRepositoryInterface',
    'ProductsRepositoryInterface',
    'OrdersRepositoryInterface',
  ],
})
export class DatabaseModule {}
