import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { BaseResponse } from 'src/libs/response/base_response';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateLoginDto } from '../auth/dto/authentication.dto';
import { JwtService } from '@nestjs/jwt';
export declare class CustomerService {
    private readonly customerRepository;
    private jwtService;
    constructor(customerRepository: Repository<Customer>, jwtService: JwtService);
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<BaseResponse<Customer>>;
    login(data: CreateLoginDto): Promise<BaseResponse<any>>;
    getAllCustomers(orderBy?: {
        [key: string]: 'ASC' | 'DESC';
    }): Promise<BaseResponse<Customer[]>>;
    getCustomerById(id: string): Promise<BaseResponse<Customer>>;
    updateCustomer(id: string, updateCustomerDto: Partial<Customer>): Promise<BaseResponse<Customer>>;
    remove(id: string): Promise<BaseResponse<void>>;
    deleteCustomer(id: string): Promise<BaseResponse<void>>;
}
