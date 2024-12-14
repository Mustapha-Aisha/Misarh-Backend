import { Module } from '@nestjs/common';
import { OrderedProductsService } from './ordered-products.service';
import { OrderedProductsController } from './ordered-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderedProductEntity } from './entities/ordered-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ ProductEntity,OrderEntity, OrderedProductEntity])],
  controllers: [OrderedProductsController],
  providers: [OrderedProductsService],
})
export class OrderedProductsModule {}
