import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>
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
  
  

}
