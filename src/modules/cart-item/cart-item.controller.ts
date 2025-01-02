import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CurrentUser } from '../user/decorator/user.decorator';
import { Customer } from '../customer/entities/customer.entity';
import { BaseResponse } from 'src/libs/response/base_response';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  updateCartItemQuantity(@Body() cartItemId: string, newQuantity: number) {
    return this.cartItemService.updateCartItemQuantity(cartItemId, newQuantity);
  }

  @Delete(':cartItemId')
  async removeCartItem(@CurrentUser() customer: Customer, 
  @Param('cartItemId') cartItemId: string,): Promise<BaseResponse<any>>{
    return this.cartItemService.removeCartItem(customer,cartItemId )
  }
}
