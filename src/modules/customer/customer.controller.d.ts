import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { Customer } from './entities/customer.entity';
import { CreateLoginDto } from '../auth/dto/authentication.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    create(createCustomerDto: CreateCustomerDto): Promise<BaseResponse<Customer>>;
    login(createCustomerDto: CreateLoginDto): Promise<BaseResponse<Customer>>;
    findAll(): Promise<BaseResponse<Customer[]>>;
    findOne(id: string): Promise<BaseResponse<Customer>>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<BaseResponse<Customer>>;
    remove(id: string): Promise<BaseResponse<void>>;
}
