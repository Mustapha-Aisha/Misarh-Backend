import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { generate_transaction_reference } from 'src/libs/common/helpers/utils';
import { Customer } from '../customer/entities/customer.entity';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
// import { PaystackService } from 'src/libs/external.api/payment/paystack';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { OrderedProductsService } from '../ordered-products/ordered-products.service';

dotenv.config();
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    // private cartService: CartService,
    // private productService : ProductsService,
    // private orderedProductService : OrderedProductsService
  ) { }

  async create(customer: Customer, paystackRef: string): Promise<BaseResponse<OrderEntity>> {
    try {
      const newOrder = this.orderRepository.create({
        customer: customer,
        status: OrderStatus.PLACED,
        trackingId: generate_transaction_reference(),
        paystackRef: paystackRef
      });
      const savedOrder = await this.orderRepository.save(newOrder);
      return BaseResponse.success(savedOrder, "Order created successfully", HttpStatus.CREATED);
    } catch (error) {
      return BaseResponse.error("Error creating order", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchAllOrders(page = 1, limit = 10): Promise<BaseResponse<any>> {
    try {
      const [orders, total] = await this.orderRepository.findAndCount();
      const pages = Math.ceil(total / limit);
      return orders.length
        ? BaseResponse.success(
            { data: orders, total, page: page, pages },
            "Orders retrieved successfully",
            HttpStatus.OK
          )
        : BaseResponse.success("No orders found", null, HttpStatus.NOT_FOUND);
    } catch (error) {
      return BaseResponse.error(
        "Error fetching orders",
        { data: [], total: 0, page, pages: 0 },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string): Promise<BaseResponse<OrderEntity>> {
    try {
      const order = await this.orderRepository.findOne({ where: { id: id } });
      if (!order) {
        return BaseResponse.error("Order not found", null, HttpStatus.NOT_FOUND);
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

  calculateDeliveryDate(): string {
    const today = new Date();
    const dayOfMonth = today.getDate();
  
    // If the order is placed before or on the 17th
    if (dayOfMonth <= 17) {
      // Schedule the delivery for the end of the current month
      // Move to the last day of the current month
      today.setMonth(today.getMonth() + 1);  // Move to next month to get last day
      today.setDate(0);  // 0th day of next month is the last day of the current month
    } else {
      // If the order is placed after the 17th, schedule for the 10th of next month
      today.setMonth(today.getMonth() + 1);  // Move to next month
      today.setDate(10);  // Set the date to the 10th of the next month
    }
  
    return today.toDateString();  // Returns the date in a readable string format (e.g., "Mon Jan 10 2025")
  }
  
  async sendEmailConfirmation(customerEmail: string, estimatedDelivery: string, orderReference: string): Promise<void> {
    console.log("email sent successfully")
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.SMTP_USER,
    //   to: customerEmail,
    //   subject: 'Order Confirmation and Delivery Information',
    //   text: `Dear Customer,

    //           Thank you for your purchase!

    //           Your order reference is: ${orderReference}.
    //           Estimated delivery date: ${estimatedDelivery}.

    //           Disclaimer: The amount you paid is for the product only. Shipping costs and delivery times may vary depending on your location in Nigeria.

    //           Thank you for choosing us!

    //           Best regards,
    //           Misarh`,
    // };

    // await transporter.sendMail(mailOptions);
  }


  
  
}
  

