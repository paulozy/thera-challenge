import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticateDTO } from './dtos/authenticate.dto';
import { AuthenticateService } from './services/authenticate.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  async login(@Body() payload: AuthenticateDTO) {
    return this.authenticateService.execute(payload);
  }
}
