import { OrderedProductsService } from './ordered-products.service';
import { CreateOrderedProductDto } from './dto/create-ordered-product.dto';
import { UpdateOrderedProductDto } from './dto/update-ordered-product.dto';
export declare class OrderedProductsController {
    private readonly orderedProductsService;
    constructor(orderedProductsService: OrderedProductsService);
    create(createOrderedProductDto: CreateOrderedProductDto): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/ordered-product.entity").OrderedProductEntity>>;
    findAll(): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/ordered-product.entity").OrderedProductEntity[]>>;
    findOne(id: string): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/ordered-product.entity").OrderedProductEntity>>;
    update(id: string, updateOrderedProductDto: UpdateOrderedProductDto): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/ordered-product.entity").OrderedProductEntity>>;
    remove(id: string): Promise<import("../../libs/response/base_response").BaseResponse<void>>;
}
