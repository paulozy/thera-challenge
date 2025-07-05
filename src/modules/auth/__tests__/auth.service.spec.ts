import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateService } from '../services/authenticate.service';
import { InMemoryHasherGateway } from '../../../../test/gateways/in-memory.hasher.gateway';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memory-users.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthenticateService;
  let usersRepository: InMemoryUsersRepository;
  let hasherGateway: InMemoryHasherGateway;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateService,
        {
          provide: 'HasherGatewayInterface',
          useClass: InMemoryHasherGateway,
        },
        {
          provide: 'UsersRepositoryInterface',
          useClass: InMemoryUsersRepository,
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn(() => 'mock-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthenticateService>(AuthenticateService);
    usersRepository = module.get<InMemoryUsersRepository>('UsersRepositoryInterface');
    hasherGateway = module.get<InMemoryHasherGateway>('HasherGatewayInterface');
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate a user and return a token', async () => {
    const user = User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
    });
    usersRepository.users.push(user);

    jest.spyOn(hasherGateway, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');

    const result = await service.execute({ email: 'test@example.com', password: 'password123' });

    expect(result).toBeDefined();
    expect(result.access_token).toBe('mock-jwt-token');
    expect(result.email).toBe('test@example.com');
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    const user = User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
    });
    usersRepository.users.push(user);

    jest.spyOn(hasherGateway, 'compare').mockResolvedValue(false);

    await expect(service.execute({ email: 'test@example.com', password: 'wrong-password' })).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    await expect(service.execute({ email: 'nonexistent@example.com', password: 'password123' })).rejects.toThrow(UnauthorizedException);
  });
});
