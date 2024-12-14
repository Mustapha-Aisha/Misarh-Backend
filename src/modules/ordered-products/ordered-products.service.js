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
exports.OrderedProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_response_1 = require("../../libs/response/base_response");
const common_2 = require("@nestjs/common");
const ordered_product_entity_1 = require("./entities/ordered-product.entity");
const product_entity_1 = require("../products/entities/product.entity");
let OrderedProductsService = class OrderedProductsService {
    constructor(orderedProductRepository, productRepository) {
        this.orderedProductRepository = orderedProductRepository;
        this.productRepository = productRepository;
    }
    async create(createOrderedProductDto) {
        try {
            const order = await this.orderedProductRepository.findOne({ where: { id: createOrderedProductDto.order } });
            const product = await this.productRepository.findOne({ where: { id: createOrderedProductDto.product } });
            if (!order || !product) {
                return base_response_1.BaseResponse.error('Order or Product not found', null, common_2.HttpStatus.BAD_REQUEST);
            }
            const newOrderedProduct = this.orderedProductRepository.create({
                order: order,
                product: product,
                quantity: createOrderedProductDto.quantity,
            });
            const savedOrderedProduct = await this.orderedProductRepository.save(newOrderedProduct);
            return base_response_1.BaseResponse.success(savedOrderedProduct, 'Ordered product created successfully', common_2.HttpStatus.CREATED);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error('Error creating ordered product', null, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            const orderedProducts = await this.orderedProductRepository.find();
            if (!orderedProducts.length) {
                return base_response_1.BaseResponse.error("No ordered products found", [], common_2.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(orderedProducts, "Ordered products retrieved successfully", common_2.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error fetching ordered products", [], common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const orderedProduct = await this.orderedProductRepository.findOne({ where: { id } });
            if (!orderedProduct) {
                return base_response_1.BaseResponse.error("Ordered product not found", null, common_2.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(orderedProduct, "Ordered product retrieved successfully", common_2.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error fetching ordered product", null, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateOrderedProductDto) {
        try {
            let orderedProduct = await this.orderedProductRepository.findOne({ where: { id: id } });
            if (!orderedProduct) {
                return base_response_1.BaseResponse.error("Ordered product not found", null, common_2.HttpStatus.NOT_FOUND);
            }
            let productEntity = orderedProduct.product;
            if (updateOrderedProductDto.product) {
                productEntity = await this.productRepository.findOne({ where: { id: updateOrderedProductDto.product } });
                if (!productEntity) {
                    return base_response_1.BaseResponse.error("Product not found", null, common_2.HttpStatus.NOT_FOUND);
                }
            }
            let orderEntity = orderedProduct.order;
            if (updateOrderedProductDto.order) {
                orderedProduct = await this.orderedProductRepository.findOne({ where: { id: updateOrderedProductDto.order } });
                if (!orderEntity) {
                    return base_response_1.BaseResponse.error("Order not found", null, common_2.HttpStatus.NOT_FOUND);
                }
            }
            const updatedOrderedProduct = await this.orderedProductRepository.save({
                ...orderedProduct,
                product: productEntity,
                order: orderEntity,
            });
            return base_response_1.BaseResponse.success(updatedOrderedProduct, "Ordered product updated successfully", common_2.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error("Error updating ordered product", null, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const orderedProduct = await this.orderedProductRepository.findOne({ where: { id } });
            if (!orderedProduct) {
                return base_response_1.BaseResponse.error("Ordered product not found", null, common_2.HttpStatus.NOT_FOUND);
            }
            await this.orderedProductRepository.delete(id);
            return base_response_1.BaseResponse.success(null, "Ordered product removed successfully", common_2.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error removing ordered product", null, common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OrderedProductsService = OrderedProductsService;
exports.OrderedProductsService = OrderedProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ordered_product_entity_1.OrderedProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrderedProductsService);
//# sourceMappingURL=ordered-products.service.js.map