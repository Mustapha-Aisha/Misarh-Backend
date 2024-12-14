import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { Customer } from './entities/customer.entity';
import { CreateLoginDto } from '../auth/dto/authentication.dto';
import { Public } from '../auth/strategy/public-strategy';


@Public()
@Controller('customer/')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<BaseResponse<Customer>> {
    return this.customerService.createCustomer(createCustomerDto);
  }


  @Post("login")
  async login(@Body() createCustomerDto: CreateLoginDto): Promise<BaseResponse<Customer>> {
    return this.customerService.login(createCustomerDto);
  }

  @Get()
  async findAll(): Promise<BaseResponse<Customer[]>> {
    return this.customerService.getAllCustomers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse<Customer>> {
    return this.customerService.getCustomerById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<BaseResponse<Customer>> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponse<void>> {
    return this.customerService.remove(id);
  }
}
