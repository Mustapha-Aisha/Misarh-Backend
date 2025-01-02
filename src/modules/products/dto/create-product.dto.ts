import { IsString, IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Category, Variation } from '../entities/product.entity';

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

    @IsEnum(Category)
    @IsOptional()
    discount?: string;

    @IsString()
    @IsOptional()
    categoryId?: Category;

    @IsString()
    @IsOptional()
    colorId?: string;

    @IsEnum(Variation)
    @IsOptional()
    variation?: Variation;

}
