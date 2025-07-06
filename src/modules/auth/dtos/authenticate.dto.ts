import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthenticateDTO {
  @ApiProperty({
    example: 'johndoe@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
