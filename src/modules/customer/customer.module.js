"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_service_1 = require("./customer.service");
const customer_entity_1 = require("./entities/customer.entity");
const customer_controller_1 = require("./customer.controller");
const order_entity_1 = require("../order/entities/order.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../../libs/config");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_entity_1.Customer, order_entity_1.OrderEntity]),
            jwt_1.JwtModule.register({
                secret: config_1.Config.JWT_SECRET,
                signOptions: { expiresIn: '3457d' },
            })
        ],
        providers: [customer_service_1.CustomerService],
        controllers: [customer_controller_1.CustomerController],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map