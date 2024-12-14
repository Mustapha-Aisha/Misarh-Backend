import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateOrderedProductDto {
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  order: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}
