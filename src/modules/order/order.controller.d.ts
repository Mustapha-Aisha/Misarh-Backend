import { OrderService } from './order.service';
import { Customer } from '../customer/entities/customer.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(customer: Customer): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/order.entity").OrderEntity>>;
    findAll(): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/order.entity").OrderEntity[]>>;
    findOne(id: string): Promise<import("../../libs/response/base_response").BaseResponse<import("./entities/order.entity").OrderEntity>>;
    cancelOrder(id: string): Promise<import("../../libs/response/base_response").BaseResponse<void>>;
}
