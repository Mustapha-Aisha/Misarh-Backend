import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartService } from '../cart/cart.service';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderedProductEntity } from '../ordered-products/entities/ordered-product.entity';
import { OrderService } from '../order/order.service';
import { OrderedProductsService } from '../ordered-products/ordered-products.service';
import { PaystackService } from 'src/libs/external.api/payment/paystack';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity, ProductEntity, OrderEntity, OrderedProductEntity])],
  controllers: [CartItemController],
  providers: [CartService, CartItemService, OrderService, OrderedProductsService,PaystackService, ConfigService],
})
export class CartItemModule {}
