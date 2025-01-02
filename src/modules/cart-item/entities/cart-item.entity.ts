import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';


@Entity('cart_item')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CartEntity, cart => cart.items, { eager: true })
  // @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, { eager: true })
  product: ProductEntity;

  @Column({ type: 'int', default: 1 })
  quantity: number; 
  
  // @Column({ type: 'varchar', default: "0" })
  // totalprice: string;


}
