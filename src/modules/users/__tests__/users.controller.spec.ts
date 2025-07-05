import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryHasherGateway } from '../../../../test/gateways/in-memory.hasher.gateway';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users.repository';
import { CreateUserService } from '../services/create-user.service';
import { UsersController } from '../users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InMemoryUsersRepository, InMemoryHasherGateway],
      controllers: [UsersController],
      providers: [CreateUserService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
