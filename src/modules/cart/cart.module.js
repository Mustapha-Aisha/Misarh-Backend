"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const cart_controller_1 = require("./cart.controller");
const typeorm_1 = require("@nestjs/typeorm");
const cart_item_entity_1 = require("../cart-item/entities/cart-item.entity");
const cart_item_service_1 = require("../cart-item/cart-item.service");
const cart_entity_1 = require("./entities/cart.entity");
const product_entity_1 = require("../products/entities/product.entity");
const ordered_product_entity_1 = require("../ordered-products/entities/ordered-product.entity");
const ordered_products_service_1 = require("../ordered-products/ordered-products.service");
const order_service_1 = require("../order/order.service");
const order_entity_1 = require("../order/entities/order.entity");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cart_entity_1.CartEntity, cart_item_entity_1.CartItemEntity, product_entity_1.ProductEntity, order_entity_1.OrderEntity, ordered_product_entity_1.OrderedProductEntity])
        ],
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService, cart_item_service_1.CartItemService, order_service_1.OrderService, ordered_products_service_1.OrderedProductsService],
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map