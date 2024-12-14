import { Customer } from 'src/modules/customer/entities/customer.entity';
import { OrderedProductEntity } from 'src/modules/ordered-products/entities/ordered-product.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
export declare enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class OrderEntity extends BaseEntity {
    id: string;
    customer: Customer;
    date_ordered: Date;
    status: OrderStatus;
    trackingId: string;
    orderedProducts: OrderedProductEntity[];
}
