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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_response_1 = require("../../libs/response/base_response");
const order_entity_1 = require("./entities/order.entity");
const utils_1 = require("../../libs/common/helpers/utils");
let OrderService = class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async create(customer) {
        try {
            const newOrder = this.orderRepository.create({
                customer: customer,
                date_ordered: new Date(),
                status: order_entity_1.OrderStatus.PENDING,
                trackingId: (0, utils_1.generate_transaction_reference)(),
            });
            const savedOrder = await this.orderRepository.save(newOrder);
            return base_response_1.BaseResponse.success(savedOrder, "Order created successfully", common_1.HttpStatus.CREATED);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error creating order", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            const orders = await this.orderRepository.find();
            if (!orders.length) {
                return base_response_1.BaseResponse.error("No orders found", [], common_1.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(orders, "Orders retrieved successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error fetching orders", [], common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const order = await this.orderRepository.findOne({ where: { id: id } });
            if (!order) {
                return base_response_1.BaseResponse.error("Order not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(order, "Order retrieved successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error fetching order", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async cancelOrder(id) {
        try {
            const existingOrder = await this.orderRepository.findOne({ where: { id } });
            if (!existingOrder) {
                return base_response_1.BaseResponse.error("Order not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.orderRepository.update(id, { status: order_entity_1.OrderStatus.CANCELLED });
            return base_response_1.BaseResponse.success(null, "Order canceled successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("An error occurred while canceling the order", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteOrder(id) {
        try {
            const order = await this.orderRepository.findOne({ where: { id } });
            if (!order) {
                return base_response_1.BaseResponse.error("Order not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.orderRepository.delete(id);
            return base_response_1.BaseResponse.success(null, "Order deleted successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error("Error deleting order", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map