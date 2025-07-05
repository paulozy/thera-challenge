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
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @Min(1)
  qty: number;
}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @IsOptional()
  userId?: string;
}
