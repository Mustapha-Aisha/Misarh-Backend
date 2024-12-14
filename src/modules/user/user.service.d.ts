import { BaseResponse } from '../../libs/response/base_response';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/user.dto';
import { Redis } from 'ioredis';
import { Queue } from 'bull';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../auth/dto/authentication.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly cacheManager;
    private readonly registrationQueue;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, cacheManager: Redis, registrationQueue: Queue, jwtService: JwtService);
    createUser(data: CreateUserDto): Promise<BaseResponse<CreateUserDto & UserEntity>>;
    getMe(userId: string): Promise<BaseResponse<UserEntity>>;
    getUserById(userId: string): Promise<BaseResponse<UserEntity>>;
    updateUser(userId: string, data: UpdateUserDto): Promise<BaseResponse<import("typeorm").UpdateResult>>;
    deleteUser(userId: string): Promise<BaseResponse<any>>;
    checkUserExist(id: string): Promise<boolean>;
}
