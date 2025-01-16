import { Injectable, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from '../cart-item/entities/cart-item.entity';
import { CartItemService } from '../cart-item/cart-item.service';
import { CartEntity } from './entities/cart.entity';
import { ProductEntity } from '../products/entities/product.entity';

import { OrderedProductEntity } from '../ordered-products/entities/ordered-product.entity';
import { OrderedProductsService } from '../ordered-products/ordered-products.service';
import { OrderService } from '../order/order.service';
import { OrderEntity } from '../order/entities/order.entity';
import { PaystackService } from 'src/libs/external.api/payment/paystack';
import { ConfigService } from '@nestjs/config';
import { NotificationGateway } from 'src/notification-gateway/notification-gateway';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerModule } from '../customer/customer.module';
// import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity, ProductEntity, OrderEntity, OrderedProductEntity, Customer]),
    CustomerModule
  ],
  controllers: [CartController],
  providers: [CartService, CartItemService, OrderService, OrderedProductsService, PaystackService, ConfigService, NotificationGateway],
  exports: [CartService],
})
export class CartModule {}
