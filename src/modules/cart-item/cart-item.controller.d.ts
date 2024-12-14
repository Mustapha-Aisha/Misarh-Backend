import { CartItemService } from './cart-item.service';
export declare class CartItemController {
    private readonly cartItemService;
    constructor(cartItemService: CartItemService);
    updateCartItemQuantity(cartItemId: string, newQuantity: number): Promise<import("../../libs/response/base_response").BaseResponse<void>>;
}
