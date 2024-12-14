import { Repository } from 'typeorm';
import { BaseResponse } from 'src/libs/response/base_response';
import { OrderEntity } from './entities/order.entity';
import { Customer } from '../customer/entities/customer.entity';
export declare class OrderService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<OrderEntity>);
    create(customer: Customer): Promise<BaseResponse<OrderEntity>>;
    findAll(): Promise<BaseResponse<OrderEntity[]>>;
    findOne(id: string): Promise<BaseResponse<OrderEntity>>;
    cancelOrder(id: string): Promise<BaseResponse<void>>;
    deleteOrder(id: string): Promise<BaseResponse<void>>;
}
