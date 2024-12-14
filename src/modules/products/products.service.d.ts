import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { BaseResponse } from 'src/libs/response/base_response';
import { PaginationDto } from 'src/libs/pagination/pagination';
import { AIAgent } from 'src/libs/external.api/misarh';
import { Customer } from '../customer/entities/customer.entity';
export declare class ProductsService {
    private productRepository;
    private ai;
    constructor(productRepository: Repository<ProductEntity>, ai: AIAgent);
    create(customer: Customer, data: CreateProductDto): Promise<BaseResponse<ProductEntity>>;
    findAll(data: PaginationDto): Promise<BaseResponse<ProductEntity[]>>;
    findOne(id: string): Promise<BaseResponse<ProductEntity>>;
    update(id: string, data: UpdateProductDto): Promise<BaseResponse<ProductEntity>>;
    remove(id: string): Promise<BaseResponse<void>>;
    delete(id: string): Promise<BaseResponse<void>>;
}
