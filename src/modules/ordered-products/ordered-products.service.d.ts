import { Repository } from 'typeorm';
import { CreateOrderedProductDto } from './dto/create-ordered-product.dto';
import { UpdateOrderedProductDto } from './dto/update-ordered-product.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { OrderedProductEntity } from './entities/ordered-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
export declare class OrderedProductsService {
    private readonly orderedProductRepository;
    private readonly productRepository;
    constructor(orderedProductRepository: Repository<OrderedProductEntity>, productRepository: Repository<ProductEntity>);
    create(createOrderedProductDto: CreateOrderedProductDto): Promise<BaseResponse<OrderedProductEntity>>;
    findAll(): Promise<BaseResponse<OrderedProductEntity[]>>;
    findOne(id: string): Promise<BaseResponse<OrderedProductEntity>>;
    update(id: string, updateOrderedProductDto: UpdateOrderedProductDto): Promise<BaseResponse<OrderedProductEntity>>;
    remove(id: string): Promise<BaseResponse<void>>;
}
