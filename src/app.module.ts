import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { DbTypeOrmConfigService } from './shared/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/entity/user.entity';
import { ProductEntity } from './modules/products/entities/product.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrderedProductsModule } from './modules/ordered-products/ordered-products.module';
import { AIAgent } from './libs/external.api/generativeAI';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { CustomerModule } from './modules/customer/customer.module';
import { OrderModule } from './modules/order/order.module';
import { NotificationModule } from './notification-gateway/notification-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DbTypeOrmConfigService
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 60000,
        maxRedirects: 2
      })
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: process.env.REDIS_URL,
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 500,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        return {
          createClient: (type) => {
            switch (type) {
              case 'client':
                return new Redis(redisUrl);
              case 'subscriber':
                return new Redis(redisUrl, {
                  enableReadyCheck: false,
                  maxRetriesPerRequest: null,
                });
              case 'bclient':
                return new Redis(redisUrl, {
                  enableReadyCheck: false,
                  maxRetriesPerRequest: null,
                });
              default:
                throw new Error('Unexpected connection type: ' + type);
            }
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secretKey = configService.get<string>('JWT_SECRET');
        if (!secretKey) {
          throw new Error('JWT_SECRET environment variable is not set');
        }
        return {
          secret: secretKey,
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProductsModule,
    OrderModule,
    OrderedProductsModule,
    CustomerModule,
    CartModule,
    CartItemModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AIAgent,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    
  ],
})
export class AppModule {}
