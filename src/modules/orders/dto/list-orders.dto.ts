import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListOrdersDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsNumber()
  @Min(1)
  page: number;

  @IsString()
  @IsOptional()
  userId?: string;
}
