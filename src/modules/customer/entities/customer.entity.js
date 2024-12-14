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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("../../cart/entities/cart.entity");
const order_entity_1 = require("../../order/entities/order.entity");
let Customer = class Customer {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name' }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password' }),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contactAddress', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "contactAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cart_entity_1.CartEntity, (cart) => cart.customer, { cascade: true, nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", cart_entity_1.CartEntity)
], Customer.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.OrderEntity, (order) => order.customer),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customer')
], Customer);
//# sourceMappingURL=customer.entity.js.map