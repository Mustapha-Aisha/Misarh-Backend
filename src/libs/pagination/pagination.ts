import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  @IsOptional()
  keywords: string;
}

