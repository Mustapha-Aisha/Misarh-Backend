import { BaseEntity } from 'src/shared/BaseEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';


@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

}
