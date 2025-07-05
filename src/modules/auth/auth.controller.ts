import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateDTO } from './dtos/authenticate.dto';
import { AuthenticateService } from './services/authenticate.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post('/login')
  async login(@Body() payload: AuthenticateDTO) {
    return this.authenticateService.execute(payload);
  }
}
