import { User } from 'src/modules/users/entities/user.entity';

export interface UsersRepositoryInterface {
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
