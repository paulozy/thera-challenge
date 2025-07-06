import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class Item {
  @ApiPropertyOptional({
    example: 'a764b234-2342-4b23-9423-4234b23423a7',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  @Min(1)
  qty: number;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    type: () => Item,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @IsOptional()
  userId?: string;
}