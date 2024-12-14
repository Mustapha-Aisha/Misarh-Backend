import { IsInt, IsString, IsOptional, IsEnum, IsDate } from 'class-validator'; 
import { OrderStatus } from '../entities/order.entity';


export class CreateOrderDto {
  @IsString()
  customer: string; 
}