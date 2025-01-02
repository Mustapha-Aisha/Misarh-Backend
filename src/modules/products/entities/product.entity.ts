import { OrderedProductEntity } from 'src/modules/ordered-products/entities/ordered-product.entity';
import { Column, Entity, Generated, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


export enum ScentType {
  BASE = 'base',   
  TOP = 'top',    
  MIDDLE = 'middle', 
  EXOTIC = 'exotic', 
}

export enum Variation {
  "15ml" = "15ml",
  "30ml" = "30ml",  
  "20ml" = "20ml",
  "50ml" = "50ml",
  "100ml" = "100ml",
}


export enum Category {
  SUBLIME = 'SUBLIME',
  PRESTIGE = 'PRESTIGE',
  IMPERIAL = 'IMPERIAL',
  DEFAULT = 'DEFAULT'
}

export interface MixDetails {
  basePerfumes: { name: string; percentage: number }[]; 
  designerOils: { name: string; percentage: number }[]; 
  customBlendRatio: string; 
}

@Entity("product")
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text' ,nullable: true })
  price: string;

  @Column({ type: 'text', nullable: true })
  scentDescription: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  discount: string;

  @Column({ type: 'enum',enum: Category, nullable: true }) 
  categoryId: Category;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'enum', enum: ScentType, nullable: true })
  scentType: ScentType; 

  @Column({ type: 'enum', enum: Variation, nullable: true })  // Using the Variation enum here
  variation: Variation; 

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string; 

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @OneToMany(()=> OrderedProductEntity, (orderedProduct) => orderedProduct.product)
  orderedProduct: OrderedProductEntity

  @Column({ type: 'json', nullable: true })
  mixDetails: MixDetails; 

  @Column({ type: 'text', nullable: true })
  resultingScentProfile: string; 
  
  @Column({ type: 'jsonb', nullable: true })
  scentNotes: string[]; 

  @Column({type: 'jsonb', name: 'otherCombinations', nullable: true})
  otherCombinations: string[]
}


export interface AIResponse{

}