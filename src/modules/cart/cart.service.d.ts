import { CreateCartDto } from './dto/create-cart.dto';
import { Customer } from '../customer/entities/customer.entity';
import { CartEntity } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';
import { ProductEntity } from '../products/entities/product.entity';
import { CartItemEntity } from '../cart-item/entities/cart-item.entity';
import { OrderedProductsService } from '../ordered-products/ordered-products.service';
import { OrderService } from '../order/order.service';
export declare class CartService {
    private cartRepository;
    private productRepository;
    private cartItemRepository;
    private orderService;
    private orderedProductService;
    constructor(cartRepository: Repository<CartEntity>, productRepository: Repository<ProductEntity>, cartItemRepository: Repository<CartItemEntity>, orderService: OrderService, orderedProductService: OrderedProductsService);
    getCart(customer: Customer): Promise<CartEntity>;
    addToCart(customer: Customer, createCartDto: CreateCartDto): Promise<BaseResponse<any>>;
    removeCartItem(customer: Customer, cartItemId: string): Promise<BaseResponse<CartEntity>>;
    clearCart(customer: Customer): Promise<BaseResponse<any>>;
    checkout(customer: Customer): Promise<BaseResponse<any>>;
    getCartItems(user: any): Promise<void>;
}
