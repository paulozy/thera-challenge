import { UsersRepositoryInterface } from 'src/@shared/infra/database/repositories/users-repository.interface';
import { User } from '../../src/modules/users/entities/user.entity';

export class InMemoryUsersRepository implements UsersRepositoryInterface {
  users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
