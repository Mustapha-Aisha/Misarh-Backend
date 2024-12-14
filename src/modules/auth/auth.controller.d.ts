import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateLoginDto, ResetAccountDto, VerifyCodeDto } from './dto/authentication.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { UserEntity } from '../user/entity/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(createLoginDto: CreateLoginDto): Promise<BaseResponse<UserEntity | null>>;
    verifyAccountEmail(verifyAccountEmail: VerifyCodeDto): Promise<BaseResponse<HttpStatus> | BaseResponse<{
        user: UserEntity;
    }>>;
    resetAccount(resetAccount: ResetAccountDto): Promise<BaseResponse<UserEntity | null>>;
    changePassword(changePassword: ChangePasswordDto): Promise<BaseResponse<UserEntity | null>>;
    resendVerificationCode(data: ResetAccountDto): Promise<BaseResponse<UserEntity | null>>;
}
