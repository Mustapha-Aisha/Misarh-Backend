import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Customer } from '../customer/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';
import { ProductEntity } from '../products/entities/product.entity';
import { CartItemEntity } from '../cart-item/entities/cart-item.entity';
import { error } from 'console';

import { OrderedProductEntity } from '../ordered-products/entities/ordered-product.entity';
import { OrderedProductsService } from '../ordered-products/ordered-products.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class CartService {
 
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
    private orderService: OrderService,
    private orderedProductService: OrderedProductsService
  ) { }

  async getCart(customer: Customer) {
    let cart = await this.cartRepository.findOne({
      where: { customer: { id: customer.id }, isCheckedOut: false },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ customer: { id: customer.id }, items: [] });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(customer: Customer, createCartDto: CreateCartDto) {
    try {
      const cart = await this.getCart(customer);
      const product = await this.productRepository.findOne({
        where: {
          id: createCartDto.productId
        }
      });
      if (!product) {
        return BaseResponse.error('Product not found', null, HttpStatus.NOT_FOUND);
      }

      let cartItem = cart.items.find((item) => item.product.id === createCartDto.productId);

      if (cartItem) {
        cartItem.quantity += createCartDto.quantity;
      } else {
        cartItem = this.cartItemRepository.create({ product, cart });
        cart.items.push(cartItem);
      }

      await this.cartItemRepository.save(cartItem);
      return BaseResponse.success(cart, 'Item added to cart successfully', HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error adding item to cart', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeCartItem(customer: Customer, cartItemId: string): Promise<BaseResponse<CartEntity>> {
    try {
      const cart = await this.getCart(customer);

      // Find the item in the cart
      const item = cart.items.find(item => item.id === cartItemId);
      if (!item) {
        return BaseResponse.error('Item does not exist', null, HttpStatus.BAD_REQUEST);
      }

      // Remove the item from the database
      await this.cartItemRepository.remove(item);

      // Remove the item from the in-memory array
      cart.items = cart.items.filter(cartItem => cartItem.id !== cartItemId);

      return BaseResponse.success(cart, 'Item removed successfully', HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error removing cart item', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async clearCart(customer: Customer) {
    try {
      const cart = await this.getCart(customer);
        if (!cart || cart.items.length === 0) {
        return BaseResponse.error("Cart is already empty", null, HttpStatus.BAD_REQUEST);
      }
        await this.cartItemRepository.delete({ cart: { id: cart.id } });
        return BaseResponse.success(null, "Cart cleared successfully", HttpStatus.OK);
    } catch (error) {
      console.error('Error clearing cart:', error);
      return BaseResponse.error("An error occurred while clearing the cart", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkout(customer: Customer) {
    try {
      const cart = await this.getCart(customer);
  
      if (!cart || cart.items.length === 0) {
        return BaseResponse.error("Cart is empty", null, HttpStatus.BAD_REQUEST);
      }

      const order = await this.orderService.create(customer);

      const orderedProducts = cart.items.map(item => ({
        product: item.product, 
        order: order,         
        quantity: item.quantity
      }));
  
      // Create each ordered product in the database
      (orderedProducts.map(async (orderedProduct) => {
        const createOrderedProductDto = {
          product: orderedProduct.product.id, 
          order: orderedProduct.order.data.id, 
          quantity: orderedProduct.quantity, 
        };
        await this.orderedProductService.create(createOrderedProductDto);
      }));
  
      // Optionally clear the cart after successful checkout
      await this.clearCart(customer);
  
      return BaseResponse.success(order, "Checkout successful", HttpStatus.OK);
    } catch (error) {
      console.log(error);
      return BaseResponse.error("Error during checkout", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCartItems(user: any) {
    throw new Error('Method not implemented.');
  }
  
  

}
