import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/libs/pagination/pagination';
import { Customer } from '../customer/entities/customer.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(customer: Customer, createProductDto: CreateProductDto): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/product.entity").ProductEntity>>;
    findAll(data: PaginationDto): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/product.entity").ProductEntity[]>>;
    findOne(id: string): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/product.entity").ProductEntity>>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/product.entity").ProductEntity>>;
    remove(id: string): Promise<import("../../libs/response/base_response").BaseResponse<void>>;
}
