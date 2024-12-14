import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto, CreateLoginDto, ResetAccountDto, VerifyCodeDto } from './dto/authentication.dto';
import { BaseResponse } from '../../libs/response/base_response';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly cacheManager;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, cacheManager: Redis, jwtService: JwtService);
    verifyWithEmail(data: VerifyCodeDto): Promise<BaseResponse<any>>;
    resendVerificationCode(data: ResetAccountDto): Promise<BaseResponse<any>>;
    resetAccount(data: ResetAccountDto): Promise<BaseResponse<any>>;
    changePassword(data: ChangePasswordDto): Promise<BaseResponse<any>>;
    login(data: CreateLoginDto): Promise<BaseResponse<any>>;
}
