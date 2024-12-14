import { CartService } from './cart.service';
import { Customer } from '../customer/entities/customer.entity';
import { CreateCartDto } from './dto/create-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(user: Customer, createCartDto: CreateCartDto): Promise<import("../../libs/response/base_response").BaseResponse<any>>;
    getCart(customer: Customer): Promise<import("./entities/cart.entity").CartEntity>;
}
