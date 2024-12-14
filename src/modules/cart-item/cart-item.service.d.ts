import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';
export declare class CartItemService {
    private cartItemRepository;
    constructor(cartItemRepository: Repository<CartItemEntity>);
    updateCartItemQuantity(cartItemId: string, newQuantity: number): Promise<BaseResponse<void>>;
}
