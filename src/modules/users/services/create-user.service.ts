import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from 'src/@shared/infra/database/repositories/users-repository.interface';
import { HasherGatewayInterface } from 'src/@shared/infra/gateways/hasher.gateway';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('HasherGatewayInterface')
    private readonly hasherGateway: HasherGatewayInterface,
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(payload: CreateUserDto) {
    const { name, email, password } = payload;

    let user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new ConflictException({ message: 'User already exists' });
    }

    const hashedPass = await this.hasherGateway.hash(password);
    user = User.create({ name, email, password: hashedPass });

    await this.usersRepository.save(user);

    return user.toJSON();
  }
}
