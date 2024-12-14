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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const typeorm_2 = require("typeorm");
const base_response_1 = require("../../libs/response/base_response");
const product_entity_1 = require("../products/entities/product.entity");
const cart_item_entity_1 = require("../cart-item/entities/cart-item.entity");
const ordered_products_service_1 = require("../ordered-products/ordered-products.service");
const order_service_1 = require("../order/order.service");
let CartService = class CartService {
    constructor(cartRepository, productRepository, cartItemRepository, orderService, orderedProductService) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderService = orderService;
        this.orderedProductService = orderedProductService;
    }
    async getCart(customer) {
        let cart = await this.cartRepository.findOne({
            where: { customer: { id: customer.id }, isCheckedOut: false },
            relations: ['items', 'items.product'],
        });
        if (!cart) {
            cart = this.cartRepository.create({ customer: { id: customer.id }, items: [] });
            await this.cartRepository.save(cart);
        }
        return cart;
    }
    async addToCart(customer, createCartDto) {
        try {
            const cart = await this.getCart(customer);
            const product = await this.productRepository.findOne({
                where: {
                    id: createCartDto.productId
                }
            });
            if (!product) {
                return base_response_1.BaseResponse.error('Product not found', null, common_1.HttpStatus.NOT_FOUND);
            }
            let cartItem = cart.items.find((item) => item.product.id === createCartDto.productId);
            if (cartItem) {
                cartItem.quantity += createCartDto.quantity;
            }
            else {
                cartItem = this.cartItemRepository.create({ product, cart });
                cart.items.push(cartItem);
            }
            await this.cartItemRepository.save(cartItem);
            return base_response_1.BaseResponse.success(cart, 'Item added to cart successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error('Error adding item to cart', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeCartItem(customer, cartItemId) {
        try {
            const cart = await this.getCart(customer);
            const item = cart.items.find(item => item.id === cartItemId);
            if (!item) {
                return base_response_1.BaseResponse.error('Item does not exist', null, common_1.HttpStatus.BAD_REQUEST);
            }
            await this.cartItemRepository.remove(item);
            cart.items = cart.items.filter(cartItem => cartItem.id !== cartItemId);
            return base_response_1.BaseResponse.success(cart, 'Item removed successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error('Error removing cart item', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async clearCart(customer) {
        try {
            const cart = await this.getCart(customer);
            if (!cart || cart.items.length === 0) {
                return base_response_1.BaseResponse.error("Cart is already empty", null, common_1.HttpStatus.BAD_REQUEST);
            }
            await this.cartItemRepository.delete({ cart: { id: cart.id } });
            return base_response_1.BaseResponse.success(null, "Cart cleared successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error('Error clearing cart:', error);
            return base_response_1.BaseResponse.error("An error occurred while clearing the cart", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkout(customer) {
        try {
            const cart = await this.getCart(customer);
            if (!cart || cart.items.length === 0) {
                return base_response_1.BaseResponse.error("Cart is empty", null, common_1.HttpStatus.BAD_REQUEST);
            }
            const order = await this.orderService.create(customer);
            const orderedProducts = cart.items.map(item => ({
                product: item.product,
                order: order,
                quantity: item.quantity
            }));
            (orderedProducts.map(async (orderedProduct) => {
                const createOrderedProductDto = {
                    product: orderedProduct.product.id,
                    order: orderedProduct.order.data.id,
                    quantity: orderedProduct.quantity,
                };
                await this.orderedProductService.create(createOrderedProductDto);
            }));
            await this.clearCart(customer);
            return base_response_1.BaseResponse.success(order, "Checkout successful", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.log(error);
            return base_response_1.BaseResponse.error("Error during checkout", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCartItems(user) {
        throw new Error('Method not implemented.');
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.CartEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        order_service_1.OrderService,
        ordered_products_service_1.OrderedProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map