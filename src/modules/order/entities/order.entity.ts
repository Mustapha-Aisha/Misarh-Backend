
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { OrderedProductEntity } from 'src/modules/ordered-products/entities/ordered-product.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum OrderStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}
  
@Entity('order')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn()
  customer: Customer;

  @Column('timestamp')
  date_ordered: Date; 

  @Column({
    type: 'enum',
    enum: OrderStatus, 
    default: OrderStatus.PENDING,
  })
  status: OrderStatus; 

  @Column({ nullable: true })
  trackingId: string; 

  @OneToMany(() => OrderedProductEntity, (orderedProduct) => orderedProduct.order)
  orderedProducts: OrderedProductEntity[]; 

}
