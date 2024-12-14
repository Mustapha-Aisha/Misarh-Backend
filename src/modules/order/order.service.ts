import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { generate_transaction_reference } from 'src/libs/common/helpers/utils';
import { Customer } from '../customer/entities/customer.entity';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(customer: Customer): Promise<BaseResponse<OrderEntity>> {
    try {
      const newOrder = this.orderRepository.create({
        customer: customer ,
        date_ordered: new Date(),
        status: OrderStatus.PENDING,
        trackingId: generate_transaction_reference(),
      });
      const savedOrder = await this.orderRepository.save(newOrder);
      return BaseResponse.success(savedOrder, "Order created successfully", HttpStatus.CREATED);
    } catch (error) {
      return BaseResponse.error("Error creating order", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //paginate this
  async findAll(): Promise<BaseResponse<OrderEntity[]>> {
    try {
      const orders = await this.orderRepository.find();
      if (!orders.length) {
        return BaseResponse.error("No orders found", [], HttpStatus.NOT_FOUND);
      }
      return BaseResponse.success(orders, "Orders retrieved successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("Error fetching orders", [], HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<BaseResponse<OrderEntity>> {
    try {
      const order = await this.orderRepository.findOne({ where: { id : id } });
      if (!order) {
        return BaseResponse.error("Order not found", null,  HttpStatus.NOT_FOUND);
      }
      return BaseResponse.success(order, "Order retrieved successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("Error fetching order", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async update(id: string, updateOrderDto: UpdateOrderDto): Promise<BaseResponse<OrderEntity>> {
  //   try {
  //     const order = await this.orderRepository.findOne({ where: { id } });
  //     if (!order) {
  //       return BaseResponse.error("Order not found", null,  HttpStatus.NOT_FOUND);
  //     }
  //     await this.orderRepository.update(id, updateOrderDto);
  //     const updatedOrder = await this.orderRepository.findOne({ where: { id } });
  //     return BaseResponse.success(updatedOrder, "Order updated successfully", HttpStatus.OK);
  //   } catch (error) {
  //     return BaseResponse.error("Error updating order", null, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async cancelOrder(id: string): Promise<BaseResponse<void>> {
    try {
      const existingOrder = await this.orderRepository.findOne({ where: { id } });
      if (!existingOrder) {
        return BaseResponse.error("Order not found", null, HttpStatus.NOT_FOUND);
      }
      await this.orderRepository.update(id, { status: OrderStatus.CANCELLED });
      return BaseResponse.success(null, "Order canceled successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("An error occurred while canceling the order", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async deleteOrder(id: string): Promise<BaseResponse<void>> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        return BaseResponse.error("Order not found", null, HttpStatus.NOT_FOUND);
      }
      await this.orderRepository.delete(id);
      return BaseResponse.success(null, "Order deleted successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("Error deleting order", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
