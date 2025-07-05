import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: PrismaUsersRepository,
    },
  ],
  exports: ['UsersRepositoryInterface'],
})
export class DatabaseModule {}
