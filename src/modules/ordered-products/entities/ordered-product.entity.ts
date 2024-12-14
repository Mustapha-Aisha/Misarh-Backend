import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/BaseEntity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity('ordered_product')
export class OrderedProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderedProducts, { eager: true })
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderedProduct, {cascade: true})
  @JoinColumn()
  product: ProductEntity;

  @Column()
  quantity: number;
}
