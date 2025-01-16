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
import { PaystackService } from 'src/libs/external.api/payment/paystack';
import { QueryRunner } from 'typeorm';
import { OrderEntity } from '../order/entities/order.entity';
import { CustomerService } from '../customer/customer.service';
import { consoleLog } from '@ngrok/ngrok';

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
    private orderedProductService: OrderedProductsService,
    private paystackService: PaystackService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async getCart(customer: Customer) {
    if(!customer) {
      throw new Error('Customer not found');
    }
    let cart = await this.cartRepository.findOne({
      where: { customer: { id: customer.id }, isCheckedOut: false },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = this.cartRepository.create({
        customer: customer,
        items: [],
      });
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
      await this.cartRepository.save(cart)
      return BaseResponse.success(null, 'Item added to cart successfully', HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error adding item to cart', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async clearCart(customer: Customer) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { customer },
        relations: ['items', 'items.product'],
      });
      if (!cart || cart.items.length === 0) {
        return BaseResponse.error("Cart is already empty", null, HttpStatus.BAD_REQUEST);
      }
      cart.items = [];
      await this.cartRepository.save(cart);

      return BaseResponse.success(null, "Cart cleared successfully", HttpStatus.OK);
    } catch (error) {
      console.error('Error clearing cart:', error);
      return BaseResponse.error("An error occurred while clearing the cart", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkout(customer: Customer, data: any): Promise<BaseResponse<any>> {
    const queryRunner = this.cartRepository.manager.connection.createQueryRunner();
    try {
      const total = '100'; // You should calculate this dynamically based on the cart items
      await queryRunner.startTransaction();
      const cart = await this.getCart(customer);
      const email = customer.email;

      if (!cart || cart.items.length === 0) {
        return BaseResponse.error("Cart is empty", null, HttpStatus.BAD_REQUEST);
      }
      const paystackResponse = await this.paystackService.initializeTransaction(total, email);

      if (!paystackResponse || !paystackResponse.status) {
        return BaseResponse.error('Error initializing payment transaction', null, HttpStatus.BAD_REQUEST);
      }
      await queryRunner.commitTransaction();
      return BaseResponse.success(
        {
          paymentUrl: paystackResponse.data.authorization_url,
        },
        'Checkout successful. Proceed to payment.',
        HttpStatus.OK
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      return BaseResponse.error("Error during checkout", null, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async processOrderAndEmail(reference: string, email: string): Promise<any> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { customer: { email: email } },
        relations: ['customer']
      });
      if (!cart) {
        throw new Error('Authenticated user not found');
      }
      cart.isCheckedOut = true;
      const order = await this.orderService.create(cart.customer, reference);

      await this.moveCartToOrder(cart.customer, order.data);
      console.log('Order processed successfully', cart.customer);

      const estimatedDelivery = this.orderService.calculateDeliveryDate();

      await this.orderService.sendEmailConfirmation(cart.customer.email, estimatedDelivery, order.data.trackingId);

      return BaseResponse.success({ order: order.data, customer: cart.customer }, 'Order processed successfully', HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error processing order', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async moveCartToOrder(customer: Customer, order: OrderEntity): Promise<void> {
    try {
      const cart = await this.getCart(customer);
      const cartItems = cart.items

      if (cartItems.length === 0) {
        throw new Error('No items in the cart to process');
      }
      for (const cartItem of cartItems) {
        const product = await this.productRepository.findOne({ where: { id: cartItem.product.id } });

        if (!product) {
          throw new Error(`Product not found for cart item: ${cartItem.id}`);
        }

        const data = {
          order: order,
          product: product,
          quantity: cartItem.quantity,
        }

        await this.orderedProductService.create(data);
      }
      cart.isCheckedOut = true;
      await this.cartRepository.save(cart)
      await this.clearCart(customer);
    } catch (error) {
      console.error('Error moving cart items to order:', error);
      throw new Error('Failed to move cart items to order');
    }
  }


}
