import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  CreateLoginDto,
  CreateUserDto,
  ResetAccountDto,
  VerifyCodeDto,
} from './dto/authentication.dto';

import { BaseResponse } from '../../libs/response/base_response';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateVerificationCode } from 'src/libs/common/helpers/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRedis() private readonly cacheManager: Redis,
    private jwtService: JwtService,
  ) {}

  /**
   *  email verification
   */
  async verifyWithEmail(data: VerifyCodeDto) {
    const userId = await this.cacheManager.get(data.email);
    if (!userId) {
      return BaseResponse.error('Invalid code', null, HttpStatus.BAD_REQUEST);
    }
  
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
  
    if (data.type === 'REGISTER') {
      await this.userRepository.update(
        { id: user.id },
        {
          email_verified_at: new Date(),
          is_email_verified: true,
        }
      );
    }
  
    return BaseResponse.success(
      null,
      'Email verified successfully',
      HttpStatus.OK,
    );
  }
  
  /**
   *  resend verification code
   */

  async resendVerificationCode(data: ResetAccountDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.generic_data }, 
    });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const code = generateVerificationCode();
    await this.cacheManager.set(user.email, code); 
    return BaseResponse.success(
      null,
      'Verification code sent successfully',
      HttpStatus.OK,
    );
  }
  

  /**
   *  reset account
   */

  async resetAccount(data: ResetAccountDto) {
    //data.generic can be email or phone or username
    const user = await this.userRepository.findOne({
      where: { email: data.generic_data }, 
    });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const code = generateVerificationCode();
    await this.cacheManager.set(user.email, code);
    return BaseResponse.success(
      null,
      'Reset code sent successfully',
      HttpStatus.OK,
    );
  }

  /**
   * change password
   */
  async changePassword(data: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email}, 
    });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(data.password, salt);
    await this.userRepository.update({ id: user.id }, user);
    return BaseResponse.success(
      null,
      'Password changed successfully',
      HttpStatus.OK,
    );
  }

  /**
   * login
   */

  async login(data: CreateLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email }, 
    }); 
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    if (!user.is_email_verified) {
      return BaseResponse.error(
        'Account not verified',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return BaseResponse.error(
        'Invalid credentials',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    const access_token = this.jwtService.sign({ sub: user });
    //delete password from user
    delete user.password;
    return BaseResponse.success(
      { user, access_token },
      'Login successful',
      HttpStatus.OK,
    );
  }
}
