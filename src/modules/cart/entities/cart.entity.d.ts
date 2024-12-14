import { CartItemEntity } from 'src/modules/cart-item/entities/cart-item.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
export declare class CartEntity {
    id: string;
    customer: Customer;
    items: CartItemEntity[];
    isCheckedOut: boolean;
}
