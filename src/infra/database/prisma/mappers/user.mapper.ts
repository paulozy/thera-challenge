import { User as RawUser } from '@prisma/client';
import { User } from 'src/modules/users/entities/user.entity';

export class UserMapper {
  static toPersistence(user: User): RawUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  static toDomain(raw: RawUser): User {
    return User.create({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }
}
