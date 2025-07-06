import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'johndoe@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @MinLength(6)
  password: string;
}
