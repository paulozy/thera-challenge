import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Macbook Pro M3',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123456789',
  })
  @IsNotEmpty()
  barcode: string;

  @ApiProperty({
    example: 'Electronics',
  })
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'The new Macbook Pro M3',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 12000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;
}
