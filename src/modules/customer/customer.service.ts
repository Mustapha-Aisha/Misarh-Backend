import { HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { BaseResponse } from 'src/libs/response/base_response';
import * as bcrypt from 'bcryptjs'
import { CreateCustomerDto } from './dto/create-customer.dto';
import { generateUniqueIdFromName } from 'src/libs/common/helpers/utils';
import { CreateLoginDto } from '../auth/dto/authentication.dto';
import { JwtService } from '@nestjs/jwt';
import { Console } from 'console';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private jwtService: JwtService
    ) { }

  // Create a new customer
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<BaseResponse<Customer>> {
    try {
      console.log("ENd point reach here")
      const existingCustomer = await this.customerRepository.findOne({
        where: [{ email: createCustomerDto.email }],
      });
      if (existingCustomer) {
        return BaseResponse.error('Email or phone number is already in use', null, HttpStatus.BAD_REQUEST);
      }

      const salt = await bcrypt.genSalt();
      createCustomerDto.password = await bcrypt.hash(createCustomerDto.password, salt);

      const customer = this.customerRepository.create(createCustomerDto);

      const user = await this.customerRepository.save(createCustomerDto);
      if (!user) {
        throw new Error('User not created');
      }
      return BaseResponse.success(customer, 'Customer created successfully', HttpStatus.CREATED);
    } catch (error) {
      return BaseResponse.error(error.message || 'Error creating customer', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(data: CreateLoginDto) {
    const customer = await this.customerRepository
    .createQueryBuilder('customer')
    .addSelect('customer.password') 
    .where('customer.email = :email', { email: data.email })
    .getOne();

    if (!customer) {
      return BaseResponse.error('Customer not found', null, HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(data.password, customer.password);

    if (!isMatch) {
      return BaseResponse.error(
        'Invalid credentials',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    const access_token = this.jwtService.sign({ sub: customer });
    //delete password from user
    delete customer.password;
    return BaseResponse.success(
      { access_token, customer },
      'Login successful',
      HttpStatus.OK,
    );
  }

  // Get all customers with optional ordering
  //  TODO: PAGINATE THIS
  async getAllCustomers(orderBy?: { [key: string]: 'ASC' | 'DESC' }): Promise<BaseResponse<Customer[]>> {
    try {
      const customers = await this.customerRepository.find({
        where:{
          is_deleted: false
        },
        order: orderBy,
      });

      if (customers.length === 0) {
        return BaseResponse.error('No customers found', null, HttpStatus.NO_CONTENT);
      }

      return BaseResponse.success(customers, 'Customers retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error(error.message || 'Error fetching customers', [], HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get a customer by ID
  async getCustomerById(id: string): Promise<BaseResponse<Customer>> {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        return BaseResponse.error(`Customer with ID ${id} not found`, null, HttpStatus.NOT_FOUND);
      }

      return BaseResponse.success(customer, 'Customer retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error(error.message || 'Error fetching customer', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update customer details
  async updateCustomer(customer: Customer, data: Partial<Customer>): Promise<BaseResponse<Customer>> {
    try {
      if (data.email || data.phone) {
        // Check if email or phone is already taken by another customer
        const existingCustomer = await this.customerRepository.findOne({
          where: [
            { email: data.email },
            { phone: data.phone },
          ],
        });
        if (existingCustomer && existingCustomer.id !== customer.id) {
          return BaseResponse.error('Email or phone number is already in use', null, HttpStatus.BAD_REQUEST);
        }
      }
      await this.customerRepository.update(customer.id, data);
      // Fetch the updated customer record
      const updatedCustomer = await this.customerRepository.findOne({ where: { id: customer.id } });
      if (!updatedCustomer) {
        return BaseResponse.error('Customer not found', null, HttpStatus.NOT_FOUND);
      }
      return BaseResponse.success(updatedCustomer, 'Customer updated successfully', HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error(error.message || 'Error updating customer', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Soft delete Customer
  async remove(id: string): Promise<BaseResponse<void>> {
    try {
      const existingCustomer = await this.customerRepository.findOne({ where: { id: id } });
      if (!existingCustomer) {
        return BaseResponse.error("Customer not found", null, HttpStatus.NOT_FOUND);
      }
      await this.customerRepository.update(id, { is_deleted: true });
      return BaseResponse.success(null, "Customer deleted successfully", HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error("An error occurred while removing the customer", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCustomer(id: string): Promise<BaseResponse<void>> {
    try {
      const customer = await this.customerRepository.findOne({ where: { id: id } });
      if (!customer) {
        return BaseResponse.error(`Customer with ID ${id} not found`, null, HttpStatus.NOT_FOUND);
      }
      await this.customerRepository.delete(id);
      return BaseResponse.success(null, 'Customer deleted successfully', HttpStatus.NO_CONTENT);
    } catch (error) {
      return BaseResponse.error(error.message || 'Error deleting customer', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}