import { IsString, IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    price?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    image_url?: string;

    @IsString()
    @IsOptional()
    discount?: string;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsString()
    @IsOptional()
    colorId?: string;

    @IsString()
    @IsOptional()
    variationId?: string;

}
