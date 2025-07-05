import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryHasherGateway } from '../../../../test/gateways/in-memory.hasher.gateway';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users.repository';
import { CreateUserService } from '../services/create-user.service';
import { UsersController } from '../users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CreateUserService,
        {
          provide: 'HasherGatewayInterface',
          useClass: InMemoryHasherGateway,
        },
        {
          provide: 'UsersRepositoryInterface',
          useClass: InMemoryUsersRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
