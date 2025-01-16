import { Controller, Get, Post, Body, Headers, HttpStatus, HttpException, Param } from '@nestjs/common';
import { CartService } from './cart.service';

import { CurrentUser } from '../user/decorator/user.decorator';
import { Customer } from '../customer/entities/customer.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { PaystackService } from 'src/libs/external.api/payment/paystack';
import { Public } from '../auth/strategy/public-strategy';
import { OrderService } from '../order/order.service';
import { NotificationGateway } from 'src/notification-gateway/notification-gateway';

@Controller('cart/')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly paystackService: PaystackService,
    private orderService: OrderService,
    private notificationGateway: NotificationGateway
  ) { }

  @Post()
  addToCart(@CurrentUser() customer: Customer, @Body() createCartDto: CreateCartDto) {
    return this.cartService.addToCart(customer, createCartDto);
  }

  @Get()
  getCart(@CurrentUser() customer: Customer) {
    return this.cartService.getCart(customer)
  }

  @Post("checkout")
  async checkout(@CurrentUser() customer: Customer, @Body() data: any): Promise<BaseResponse<any>> {
    return await this.cartService.checkout(customer, data)
  }
  
  @Post('processOrders')
  async processOrders(@CurrentUser() customer: Customer, @Body() data: any): Promise<BaseResponse<any>> {
    return await this.cartService.processOrderAndEmail(data.reference, data.clearCartcustomer);
  }
  
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    try {
      const result = await this.paystackService.handleWebhook(payload, signature);

      if (result.status === 'success') {
        const order = await this.cartService.processOrderAndEmail(payload.data.reference, result.data);

        this.notificationGateway.sendPaymentNotification(`${order.data.customer.id}`, {
          message: 'Payment verified successfully',
          orderId: order.data.order.id,
        });
        return {
          statusCode: HttpStatus.OK,
          message: "Payment verified and order processed successfully",
          order,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Payment verification failed",
        };
      }
    } catch (error) {
      console.log(`Webhook handling error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


}