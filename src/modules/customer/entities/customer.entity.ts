import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';


@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'password' , select: false})
  password: string;

  @Column({ name: 'contactAddress', nullable: true })
  contactAddress: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'is_deleted', default: false, select: false })
  is_deleted: boolean;

  @OneToOne(() => CartEntity, (cart) => cart.customer, { cascade: true, nullable: true })
  @JoinColumn() 
  cart: CartEntity;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];
}




