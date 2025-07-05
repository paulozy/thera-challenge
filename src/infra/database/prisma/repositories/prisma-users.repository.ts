import { Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from 'src/@shared/infra/database/repositories/users-repository.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const rawData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!rawData) {
      return undefined;
    }

    return UserMapper.toDomain(rawData);
  }

  async save(user: User): Promise<void> {
    const rawData = UserMapper.toPersistence(user);

    await this.prisma.user.create({
      data: rawData,
    });

    return;
  }
}
