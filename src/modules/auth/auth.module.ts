import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SendEmailConsumer } from './consumer/send-email.consumer';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { Config } from 'src/libs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: '3457d' },
    }),
    // BullModule.registerQueue({
    //   name: Config.CREATE_USER_QUEUE,
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // SendEmailConsumer,
  ],
})
export class AuthModule {}
