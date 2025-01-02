import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { OrderEntity } from './entities/order.entity';
import { PaystackService } from 'src/libs/external.api/payment/paystack';
import { ConfigService } from '@nestjs/config';
import { CartService } from '../cart/cart.service';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { OrderedProductsModule } from '../ordered-products/ordered-products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, OrderEntity]),
    // CartModule,
    // ProductsModule,
    // OrderedProductsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PaystackService, ConfigService],
})
export class OrderModule {}
