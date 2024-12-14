import { Body, Controller, Get, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateLoginDto,
  CreateUserDto,
  ResetAccountDto,
  VerifyCodeDto,
} from './dto/authentication.dto';
import { Public } from './strategy/public-strategy';
import { BaseResponse } from 'src/libs/response/base_response';
import { UserEntity } from '../user/entity/user.entity';

@Public()
@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() createLoginDto: CreateLoginDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authService.login(createLoginDto);
  } 

  @Post('verify-account-email')
  async verifyAccountEmail(
    @Body() verifyAccountEmail: VerifyCodeDto,
  ): Promise<BaseResponse<HttpStatus> | BaseResponse<{ user: UserEntity }>> {
    return this.authService.verifyWithEmail(verifyAccountEmail);
  }

  @Post('reset-account')
  async resetAccount(
    @Body() resetAccount: ResetAccountDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authService.resetAccount(resetAccount);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authService.changePassword(changePassword);
  }

  //resendVerificationCode
  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body() data: ResetAccountDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authService.resendVerificationCode(data);
  }
}
