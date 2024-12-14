"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedProductsModule = void 0;
const common_1 = require("@nestjs/common");
const ordered_products_service_1 = require("./ordered-products.service");
const ordered_products_controller_1 = require("./ordered-products.controller");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const order_entity_1 = require("../order/entities/order.entity");
const ordered_product_entity_1 = require("./entities/ordered-product.entity");
let OrderedProductsModule = class OrderedProductsModule {
};
exports.OrderedProductsModule = OrderedProductsModule;
exports.OrderedProductsModule = OrderedProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.ProductEntity, order_entity_1.OrderEntity, ordered_product_entity_1.OrderedProductEntity])],
        controllers: [ordered_products_controller_1.OrderedProductsController],
        providers: [ordered_products_service_1.OrderedProductsService],
    })
], OrderedProductsModule);
//# sourceMappingURL=ordered-products.module.js.map