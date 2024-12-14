"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const user_module_1 = require("./modules/user/user.module");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
const auth_guard_1 = require("./modules/auth/guard/auth.guard");
const db_config_1 = require("./shared/db.config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./modules/user/entity/user.entity");
const product_entity_1 = require("./modules/products/entities/product.entity");
const axios_1 = require("@nestjs/axios");
const auth_module_1 = require("./modules/auth/auth.module");
const products_module_1 = require("./modules/products/products.module");
const ordered_products_module_1 = require("./modules/ordered-products/ordered-products.module");
const misarh_1 = require("./libs/external.api/misarh");
const cart_module_1 = require("./modules/cart/cart.module");
const cart_item_module_1 = require("./modules/cart-item/cart-item.module");
const customer_module_1 = require("./modules/customer/customer.module");
const order_module_1 = require("./modules/order/order.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: db_config_1.DbTypeOrmConfigService
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                product_entity_1.ProductEntity
            ]),
            axios_1.HttpModule.registerAsync({
                useFactory: () => ({
                    timeout: 60000,
                    maxRedirects: 2
                })
            }),
            ioredis_1.RedisModule.forRootAsync({
                useFactory: () => ({
                    type: 'single',
                    url: process.env.REDIS_URL,
                }),
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 500,
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redisUrl = configService.get('REDIS_URL');
                    return {
                        createClient: (type) => {
                            switch (type) {
                                case 'client':
                                    return new ioredis_2.default(redisUrl);
                                case 'subscriber':
                                    return new ioredis_2.default(redisUrl, {
                                        enableReadyCheck: false,
                                        maxRetriesPerRequest: null,
                                    });
                                case 'bclient':
                                    return new ioredis_2.default(redisUrl, {
                                        enableReadyCheck: false,
                                        maxRetriesPerRequest: null,
                                    });
                                default:
                                    throw new Error('Unexpected connection type: ' + type);
                            }
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const secretKey = configService.get('JWT_SECRET');
                    if (!secretKey) {
                        throw new Error('JWT_SECRET environment variable is not set');
                    }
                    return {
                        secret: secretKey,
                        signOptions: { expiresIn: '1d' },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            order_module_1.OrderModule,
            ordered_products_module_1.OrderedProductsModule,
            customer_module_1.CustomerModule,
            cart_module_1.CartModule,
            cart_item_module_1.CartItemModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            misarh_1.AIAgent,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map