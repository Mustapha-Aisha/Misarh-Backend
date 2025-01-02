import { Injectable, HttpException, HttpStatus, Logger, Body, Headers, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class PaystackService {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly logger = new Logger(PaystackService.name);

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASE_URL');
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  // Initialize Payment Transaction
  async initializeTransaction(amount: string, email: string): Promise<any> {
    const data = {
      amount: parseInt(amount, 10) * 100, 
      email
    };

    try {
      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, data, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data; 
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Paystack API call failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //  Verify Payment Transaction
  async verifyPayment(data: any): Promise<any> {
    console.log(data)
    try {
        const response = await axios.get(`${this.baseUrl}/transaction/verify/${data.reference}`, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        this.logger.error(`Failed to verify payment for reference ${data.reference}: ${error.message}`);
        throw new HttpException('Unable to verify payment. Please contact support.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

  //Handle Webhook for Payment Verification
  async handleWebhook(payload: any, signature: string) {
    if (!payload || !signature) {
      throw new BadRequestException('Payload or signature missing');
    }
  
    if (!this.verifySignature(payload, signature)) {
      this.logger.warn('Invalid Paystack Webhook signature');
      throw new BadRequestException('Invalid signature');
    }
  
    this.logger.log('Signature validated successfully');
  
    if (status === 'success') {
      const paymentData = await this.verifyPayment(payload);
      if (paymentData.status === 'success') {
        return { status: 'success', message: 'Payment verified successfully.' };
      } else {
        this.logger.warn(`Payment verification failed for reference: ${payload.reference}`);
        return { status: 'failed', message: 'Payment verification failed.' };
      }
    } else {
      this.logger.warn(`Payment status is not successful: ${status}`);
      return { status: 'failed', message: 'Payment failed.' };
    }
  }
  

  // Signature Verification (HMAC)
  private verifySignature(payload: any, signature: string): boolean {
    const payloadString = JSON.stringify(payload);
    const calculatedSignature = createHmac('sha512', this.secretKey)
      .update(payloadString, 'utf-8')
      .digest('hex'); 

    return calculatedSignature === signature;
  }

}
