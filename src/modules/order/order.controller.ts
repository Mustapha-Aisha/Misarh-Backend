import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { Customer } from '../customer/entities/customer.entity';
import { CurrentUser } from '../user/decorator/user.decorator';

@Controller('order/')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@CurrentUser() customer: Customer, data: string) {
    return this.orderService.create(customer, data);
  }


  @Get()
  async fetchAllOrders(@Query('page') page: number, @Query('limit') limit: number) {
    return this.orderService.fetchAllOrders(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(id, updateOrderDto);
  // }

  @Patch(':id')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
