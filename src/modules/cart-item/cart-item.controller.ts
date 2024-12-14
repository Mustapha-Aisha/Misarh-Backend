import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartItemService } from './cart-item.service';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  updateCartItemQuantity(@Body() cartItemId: string, newQuantity: number) {
    return this.cartItemService.updateCartItemQuantity(cartItemId, newQuantity);
  }
}
