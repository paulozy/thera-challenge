import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthenticateDTO } from '../dtos/authenticate.dto';
import { AuthenticateService } from '../services/authenticate.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authenticateService: AuthenticateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthenticateService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authenticateService = module.get<AuthenticateService>(AuthenticateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const authDto: AuthenticateDTO = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        id: 'user-id',
        name: 'test',
        email: 'test@example.com',
        access_token: 'mock-access-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(authenticateService, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.login(authDto);
      expect(result).toEqual(expectedResult);
      expect(authenticateService.execute).toHaveBeenCalledWith(authDto);
    });

    it('should throw UnauthorizedException on failed login', async () => {
      const authDto: AuthenticateDTO = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authenticateService, 'execute')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(authDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authenticateService.execute).toHaveBeenCalledWith(authDto);
    });
  });
});
