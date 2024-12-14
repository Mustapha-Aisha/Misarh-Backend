import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
export declare class Customer {
    id: string;
    name: string;
    password: string;
    contactAddress: string;
    email: string;
    phone: string;
    is_deleted: boolean;
    cart: CartEntity;
    orders: OrderEntity[];
}
