import {  Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { SendEmailConsumer } from '../auth/consumer/send-email.consumer';
import { Config } from 'src/libs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3457d' },
    }),
    BullModule.registerQueue({
      name: Config.CREATE_USER_QUEUE,
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    SendEmailConsumer,
  ],
})
export class UserModule {}
