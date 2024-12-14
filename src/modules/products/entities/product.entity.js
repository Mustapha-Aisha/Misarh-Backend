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
exports.ProductEntity = exports.Category = exports.Variation = exports.ScentType = void 0;
const ordered_product_entity_1 = require("../../ordered-products/entities/ordered-product.entity");
const typeorm_1 = require("typeorm");
var ScentType;
(function (ScentType) {
    ScentType["BASE"] = "base";
    ScentType["TOP"] = "top";
    ScentType["MIDDLE"] = "middle";
    ScentType["EXOTIC"] = "exotic";
})(ScentType || (exports.ScentType = ScentType = {}));
var Variation;
(function (Variation) {
    Variation[Variation["12ml"] = 12] = "12ml";
    Variation[Variation["15ml"] = 15] = "15ml";
    Variation[Variation["20ml"] = 20] = "20ml";
    Variation[Variation["30ml"] = 30] = "30ml";
    Variation[Variation["50ml"] = 50] = "50ml";
    Variation[Variation["100ml"] = 100] = "100ml";
})(Variation || (exports.Variation = Variation = {}));
var Category;
(function (Category) {
    Category["STANDARD"] = "standard";
    Category["CUSTOM"] = "custom";
    Category["LIMITED"] = "limited";
    Category["SIGNATURE"] = "signature";
})(Category || (exports.Category = Category = {}));
let ProductEntity = class ProductEntity {
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ProductEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "scentDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScentType, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "scentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Variation, nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "variation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProductEntity.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ordered_product_entity_1.OrderedProductEntity, (orderedProduct) => orderedProduct.product),
    __metadata("design:type", ordered_product_entity_1.OrderedProductEntity)
], ProductEntity.prototype, "orderedProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "mixDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "resultingScentProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], ProductEntity.prototype, "scentNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'otherCombinations', nullable: true }),
    __metadata("design:type", Array)
], ProductEntity.prototype, "otherCombinations", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, typeorm_1.Entity)("product")
], ProductEntity);
//# sourceMappingURL=product.entity.js.map