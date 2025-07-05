import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryHasherGateway } from '../../../../test/gateways/in-memory.hasher.gateway';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users.repository';
import { User } from '../entities/user.entity';
import { CreateUserService } from '../services/create-user.service';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let usersRepository: InMemoryUsersRepository;
  let hasherGateway: InMemoryHasherGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CreateUserService>(CreateUserService);
    usersRepository = module.get<InMemoryUsersRepository>(
      'UsersRepositoryInterface',
    );
    hasherGateway = module.get<InMemoryHasherGateway>('HasherGatewayInterface');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user successfully', async () => {
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await service.execute(payload);

    expect(result).toBeDefined();
    expect(result.name).toBe(payload.name);
    expect(result.email).toBe(payload.email);
    expect(usersRepository.users.length).toBe(1);
    expect(usersRepository.users[0].password).toBe(
      `hashed_${payload.password}`,
    );
  });

  it('should throw ConflictException if user with email already exists', async () => {
    const payload = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
    };

    await usersRepository.save(
      User.create({
        ...payload,
        password: await hasherGateway.hash(payload.password),
      }),
    );

    await expect(service.execute(payload)).rejects.toThrow(ConflictException);
    await expect(service.execute(payload)).rejects.toThrow(
      'User already exists',
    );
  });
});
