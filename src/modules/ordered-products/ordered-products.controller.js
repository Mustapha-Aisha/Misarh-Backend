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
exports.OrderedProductsController = void 0;
const common_1 = require("@nestjs/common");
const ordered_products_service_1 = require("./ordered-products.service");
const create_ordered_product_dto_1 = require("./dto/create-ordered-product.dto");
const update_ordered_product_dto_1 = require("./dto/update-ordered-product.dto");
let OrderedProductsController = class OrderedProductsController {
    constructor(orderedProductsService) {
        this.orderedProductsService = orderedProductsService;
    }
    create(createOrderedProductDto) {
        return this.orderedProductsService.create(createOrderedProductDto);
    }
    findAll() {
        return this.orderedProductsService.findAll();
    }
    findOne(id) {
        return this.orderedProductsService.findOne(id);
    }
    update(id, updateOrderedProductDto) {
        return this.orderedProductsService.update(id, updateOrderedProductDto);
    }
    remove(id) {
        return this.orderedProductsService.remove(id);
    }
};
exports.OrderedProductsController = OrderedProductsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ordered_product_dto_1.CreateOrderedProductDto]),
    __metadata("design:returntype", void 0)
], OrderedProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderedProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderedProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ordered_product_dto_1.UpdateOrderedProductDto]),
    __metadata("design:returntype", void 0)
], OrderedProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderedProductsController.prototype, "remove", null);
exports.OrderedProductsController = OrderedProductsController = __decorate([
    (0, common_1.Controller)('ordered-products'),
    __metadata("design:paramtypes", [ordered_products_service_1.OrderedProductsService])
], OrderedProductsController);
//# sourceMappingURL=ordered-products.controller.js.map