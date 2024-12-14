import { CartItemEntity } from 'src/modules/cart-item/entities/cart-item.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, Column, OneToOne } from 'typeorm';


@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Customer, (customer) => customer.cart)
  customer: Customer;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItemEntity[];

  @Column({ default: false })
  isCheckedOut: boolean;
}
