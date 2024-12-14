"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const jwt_strategy_1 = require("../auth/strategy/jwt.strategy");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entity/user.entity");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bull_1 = require("@nestjs/bull");
const send_email_consumer_1 = require("../auth/consumer/send-email.consumer");
const config_2 = require("../../libs/config");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '3457d' },
            }),
            bull_1.BullModule.registerQueue({
                name: config_2.Config.CREATE_USER_QUEUE,
            }),
        ],
        controllers: [user_controller_1.UserController],
        providers: [
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            send_email_consumer_1.SendEmailConsumer,
        ],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map