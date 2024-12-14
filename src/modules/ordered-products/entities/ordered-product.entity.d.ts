import { BaseEntity } from 'src/shared/BaseEntity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
export declare class OrderedProductEntity extends BaseEntity {
    id: string;
    order: OrderEntity;
    product: ProductEntity;
    quantity: number;
}
