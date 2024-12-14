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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const typeorm_2 = require("typeorm");
const base_response_1 = require("../../libs/response/base_response");
let CartItemService = class CartItemService {
    constructor(cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }
    async updateCartItemQuantity(cartItemId, newQuantity) {
        try {
            if (newQuantity <= 0) {
                return base_response_1.BaseResponse.error('Quantity must be greater than zero', null, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.cartItemRepository
                .createQueryBuilder()
                .update(cart_item_entity_1.CartItemEntity)
                .set({ quantity: newQuantity })
                .where('id = :id', { id: cartItemId })
                .execute();
            if (result.affected === 0) {
                return base_response_1.BaseResponse.error('Cart item not found', null, common_1.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(null, 'Cart item quantity updated successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error('Error updating cart item quantity', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CartItemService = CartItemService;
exports.CartItemService = CartItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CartItemService);
//# sourceMappingURL=cart-item.service.js.map