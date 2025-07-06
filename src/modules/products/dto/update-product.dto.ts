import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Macbook Pro M3',
  })
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: '123456789',
  })
  @IsNotEmpty()
  barcode?: string;

  @ApiPropertyOptional({
    example: 'Electronics',
  })
  @IsNotEmpty()
  category?: string;

  @ApiPropertyOptional({
    example: 'The new Macbook Pro M3',
  })
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    example: 12000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock?: number;
}