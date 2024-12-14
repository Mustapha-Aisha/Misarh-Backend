import { BaseEntity } from 'src/shared/BaseEntity';
export declare class UserEntity extends BaseEntity {
    id: string;
    name: string;
    email: string;
    username: string;
    phone: string;
    is_email_verified: boolean;
    email_verified_at: Date;
    password: string;
    is_deleted: boolean;
}
