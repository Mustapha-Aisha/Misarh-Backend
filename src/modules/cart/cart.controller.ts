import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';

import { CurrentUser } from '../user/decorator/user.decorator';
import { Customer } from '../customer/entities/customer.entity';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart( @CurrentUser() user: Customer, @Body() createCartDto: CreateCartDto) {
    return this.cartService.addToCart(user, createCartDto);
  }

  @Get()
  getCart (@CurrentUser() customer: Customer){
    return this.cartService.getCart(customer)
  }


  // @Get('cart')
  // getCart(@CurrentUser() user: Customer) {
  // console.log( "HELLO I'M WORKING------:");  
  // // return this.cartService.getCartItems(user);  
  // }



}
