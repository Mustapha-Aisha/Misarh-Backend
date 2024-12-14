import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseResponse } from '../../libs/response/base_response';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/user.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { InjectQueue } from '@nestjs/bull';
import { Config } from 'src/libs/config';
import { Queue } from 'bull';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../auth/dto/authentication.dto';
import * as bcrypt from "bcryptjs"
import { generateVerificationCode, generateUniqueIdFromName } from 'src/libs/common/helpers/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRedis() private readonly cacheManager: Redis,
    @InjectQueue(Config.CREATE_USER_QUEUE)
    private readonly registrationQueue: Queue,
    private jwtService: JwtService,
  ) {}

  /**
   *  create user
   */
  async createUser(data: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    //add user_id to data
    data['user_id'] = generateUniqueIdFromName(data.name);
    const user = await this.userRepository.save(data);

    if (!user) {
      throw new Error('User not created');
    }
    // const code = generateVerificationCode();
    // await this.cacheManager.set(data.email, code);
    // await this.registrationQueue.add({
    //   code,
    //   user: user,
    //   type: Config.VERIFICATION_TYPE,
    // });

    return BaseResponse.success(
      user,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId }});
    delete user.password;
    return BaseResponse.success(
      user,
      'User fetched successfully',
      HttpStatus.OK,
    );
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne(
      { 
        where: 
        { id: userId }
      },
    );
    return BaseResponse.success(
      user,
      'User fetched successfully',
      HttpStatus.OK,
    );
  }


  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await this.userRepository.update({ id: userId }, data);
    return BaseResponse.success(
      user,
      'User updated successfully',
      HttpStatus.OK,
    );
  }

  async deleteUser(userId: string) {
    try {
      await this.userRepository.update(
        { id: userId },
        { is_deleted: true } 
      );
    
      return BaseResponse.success(
        null,
        'User deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      console.log(error)
    }
  }
  
  async checkUserExist(id: string) {
    const user = await this.userRepository.findOne({ 
      where: 
      { id: id }
    },);
    return !!user;
  }
}
