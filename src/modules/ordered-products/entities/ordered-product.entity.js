"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedProductEntity = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("../../../shared/BaseEntity");
const product_entity_1 = require("../../products/entities/product.entity");
const order_entity_1 = require("../../order/entities/order.entity");
let OrderedProductEntity = class OrderedProductEntity extends BaseEntity_1.BaseEntity {
};
exports.OrderedProductEntity = OrderedProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderedProductEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.OrderEntity, (order) => order.orderedProducts, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", order_entity_1.OrderEntity)
], OrderedProductEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, (product) => product.orderedProduct, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", product_entity_1.ProductEntity)
], OrderedProductEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderedProductEntity.prototype, "quantity", void 0);
exports.OrderedProductEntity = OrderedProductEntity = __decorate([
    (0, typeorm_1.Entity)('ordered_product')
], OrderedProductEntity);
//# sourceMappingURL=ordered-product.entity.js.map