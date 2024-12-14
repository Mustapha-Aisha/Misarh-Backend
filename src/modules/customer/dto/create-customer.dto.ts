import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  // @IsPhoneNumber(null)
  // @IsOptional()
  // phone?: string;
}

