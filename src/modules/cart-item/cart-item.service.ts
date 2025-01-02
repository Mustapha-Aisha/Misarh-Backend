import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';
import { Customer } from '../customer/entities/customer.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
    private cartService: CartService
  ){}

  async updateCartItemQuantity(cartItemId: string, newQuantity: number): Promise<BaseResponse<void>> {
    try {
      if (newQuantity <= 0) {
        return BaseResponse.error('Quantity must be greater than zero', null, HttpStatus.BAD_REQUEST);
      }
  
      // Perform an update directly in the database
      const result = await this.cartItemRepository
        .createQueryBuilder()
        .update(CartItemEntity)
        .set({ quantity: newQuantity })
        .where('id = :id', { id: cartItemId })
        .execute();
  
      if (result.affected === 0) {
        return BaseResponse.error('Cart item not found', null, HttpStatus.NOT_FOUND);
      }
  
      return BaseResponse.success(null, 'Cart item quantity updated successfully', HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error updating cart item quantity', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeCartItem(customer: Customer, cartItemId: string): Promise<BaseResponse<CartEntity>> {
    try {

      const cart = await this.cartService.getCart(customer);
      const item = cart.items.find(item => item.id === cartItemId);
      if (item === null) {
        return BaseResponse.error('Item does not exist', null, HttpStatus.BAD_REQUEST);
      }
      console.log(item)

      await this.cartItemRepository.delete(item);

      cart.items = cart.items.filter(cartItem => cartItem.id !== cartItemId);

      return BaseResponse.success(cart, 'Item removed successfully', HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error removing cart item', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCartItems(user: any) {
    throw new Error('Method not implemented.');
  }
  
  

}
