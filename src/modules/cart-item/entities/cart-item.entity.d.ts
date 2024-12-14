import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
export declare class CartItemEntity {
    id: string;
    cart: CartEntity;
    product: ProductEntity;
    quantity: number;
    price: number;
}
