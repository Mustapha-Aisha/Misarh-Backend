import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './customer.controller';
import { OrderEntity } from '../order/entities/order.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Config } from 'src/libs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, OrderEntity]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: '3457d' },
    })],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule { }
