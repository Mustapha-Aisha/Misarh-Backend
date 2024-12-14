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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const base_response_1 = require("../../libs/response/base_response");
const misarh_1 = require("../../libs/external.api/misarh");
let ProductsService = class ProductsService {
    constructor(productRepository, ai) {
        this.productRepository = productRepository;
        this.ai = ai;
    }
    async create(customer, data) {
        const queryRunner = this.productRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const product = this.productRepository.create(data);
            await queryRunner.manager.save(product);
            let aiResponseData = await this.ai.generateScentProfile(product.scentDescription);
            console.log(aiResponseData);
            product.categoryId;
            product.discount;
            product.image_url;
            product.notes = aiResponseData.Notes;
            product.mixDetails = aiResponseData['Mix Details'];
            product.resultingScentProfile = aiResponseData["Resulting Scent Profile"];
            product.scentNotes = aiResponseData["Scent Notes"];
            product.name = aiResponseData.Name;
            product.scentType;
            product.price;
            product.variation;
            product.otherCombinations = aiResponseData["Other Combinations"];
            console.log(product);
            await queryRunner.manager.save(product);
            await queryRunner.commitTransaction();
            return base_response_1.BaseResponse.success(product, "Product created successfully", common_1.HttpStatus.CREATED);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error);
            return base_response_1.BaseResponse.error("An error occurred while creating the product", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(data) {
        try {
            const pageSize = parseInt(data.limit, 10) || 10;
            const currentPage = parseInt(data.page, 10) || 1;
            const skip = (currentPage - 1) * pageSize;
            const query = this.productRepository.createQueryBuilder().offset(skip).limit(pageSize);
            console.log(await query.getCount());
            const products = await query.getMany();
            return base_response_1.BaseResponse.success(products, "Products retrieved successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error("Error fetching products:", error);
            return base_response_1.BaseResponse.error("An error occurred while fetching the products", [], common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const product = await this.productRepository.findOne({ where: { id: id } });
            if (!product) {
                return base_response_1.BaseResponse.error("Product not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(product, "Product retrieved successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error("An error occurred while fetching the product", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            const existingProduct = await this.productRepository.findOne({ where: { id: id } });
            if (!existingProduct) {
                return base_response_1.BaseResponse.error("Product not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.productRepository.update(id, data);
            const updatedProduct = await this.productRepository.findOne({ where: { id: id } });
            return base_response_1.BaseResponse.success(updatedProduct, "Product updated successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error("An error occurred while updating the product", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const existingProduct = await this.productRepository.findOne({ where: { id: id } });
            if (!existingProduct) {
                return base_response_1.BaseResponse.error("Product not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.productRepository.update(id, { is_deleted: true });
            return base_response_1.BaseResponse.success(null, "Product deleted successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error("An error occurred while removing the product", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            const existingProduct = await this.productRepository.findOne({ where: { id: id } });
            if (!existingProduct) {
                return base_response_1.BaseResponse.error("Product not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.productRepository.delete(id);
            return base_response_1.BaseResponse.success(null, "Product deleted permanently", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error("An error occurred while deleting the product", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        misarh_1.AIAgent])
], ProductsService);
//# sourceMappingURL=products.service.js.map