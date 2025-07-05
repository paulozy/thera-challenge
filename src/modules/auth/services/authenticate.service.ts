import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepositoryInterface } from 'src/@shared/infra/database/repositories/users-repository.interface';
import { HasherGatewayInterface } from 'src/@shared/infra/gateways/hasher.gateway';
import { AuthenticateDTO } from '../dtos/authenticate.dto';

@Injectable()
export class AuthenticateService {
  constructor(
    @Inject('HasherGatewayInterface')
    private readonly hasherGateway: HasherGatewayInterface,
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: AuthenticateDTO) {
    const user = await this.usersRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const matchPass = await this.hasherGateway.compare(
      payload.password,
      user.password,
    );
    if (!matchPass) {
      throw new UnauthorizedException();
    }

    const token = await this.jwtService.signAsync(user.toJSON(), {
      expiresIn: '2d',
    });

    return {
      ...user.toJSON(),
      access_token: token,
    };
  }
}
