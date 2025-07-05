import { IsNumber, IsOptional, Min } from 'class-validator';

export class ListProductsDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsNumber()
  @Min(1)
  page: number;
}
