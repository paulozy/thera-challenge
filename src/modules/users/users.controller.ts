import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserService } from './services/create-user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() payload: CreateUserDto) {
    return this.createUserService.execute(payload);
  }
}
