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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const base_response_1 = require("../../libs/response/base_response");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let CustomerService = class CustomerService {
    constructor(customerRepository, jwtService) {
        this.customerRepository = customerRepository;
        this.jwtService = jwtService;
    }
    async createCustomer(createCustomerDto) {
        try {
            const existingCustomer = await this.customerRepository.findOne({
                where: [{ email: createCustomerDto.email }],
            });
            if (existingCustomer) {
                return base_response_1.BaseResponse.error('Email or phone number is already in use', null, common_1.HttpStatus.BAD_REQUEST);
            }
            const salt = await bcrypt.genSalt();
            createCustomerDto.password = await bcrypt.hash(createCustomerDto.password, salt);
            const customer = this.customerRepository.create(createCustomerDto);
            const user = await this.customerRepository.save(createCustomerDto);
            if (!user) {
                throw new Error('User not created');
            }
            return base_response_1.BaseResponse.success(customer, 'Customer created successfully', common_1.HttpStatus.CREATED);
        }
        catch (error) {
            return base_response_1.BaseResponse.error(error.message || 'Error creating customer', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(data) {
        const customer = await this.customerRepository.findOne({
            where: { email: data.email },
        });
        if (!customer) {
            return base_response_1.BaseResponse.error('User not found', null, common_1.HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(data.password, customer.password);
        if (!isMatch) {
            return base_response_1.BaseResponse.error('Invalid credentials', null, common_1.HttpStatus.BAD_REQUEST);
        }
        const access_token = this.jwtService.sign({ sub: customer });
        delete customer.password;
        return base_response_1.BaseResponse.success({ access_token }, 'Login successful', common_1.HttpStatus.OK);
    }
    async getAllCustomers(orderBy) {
        try {
            const customers = await this.customerRepository.find({
                where: {
                    is_deleted: false
                },
                order: orderBy,
            });
            if (customers.length === 0) {
                return base_response_1.BaseResponse.error('No customers found', null, common_1.HttpStatus.NO_CONTENT);
            }
            return base_response_1.BaseResponse.success(customers, 'Customers retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error(error.message || 'Error fetching customers', [], common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCustomerById(id) {
        try {
            const customer = await this.customerRepository.findOne({ where: { id } });
            if (!customer) {
                return base_response_1.BaseResponse.error(`Customer with ID ${id} not found`, null, common_1.HttpStatus.NOT_FOUND);
            }
            return base_response_1.BaseResponse.success(customer, 'Customer retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return base_response_1.BaseResponse.error(error.message || 'Error fetching customer', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCustomer(id, updateCustomerDto) {
        try {
            const customer = await this.customerRepository.findOne({ where: { id } });
            if (!customer) {
                return base_response_1.BaseResponse.error(`Customer with ID ${id} not found`, null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.customerRepository.update(id, updateCustomerDto);
            const updatedCustomer = await this.customerRepository.findOne({ where: { id } });
            return base_response_1.BaseResponse.success(updatedCustomer, 'Customer deleted successfully', common_1.HttpStatus.NO_CONTENT);
        }
        catch (error) {
            return base_response_1.BaseResponse.error(error.message || 'Error deleting customer', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const existingCustomer = await this.customerRepository.findOne({ where: { id: id } });
            if (!existingCustomer) {
                return base_response_1.BaseResponse.error("Customer not found", null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.customerRepository.update(id, { is_deleted: true });
            return base_response_1.BaseResponse.success(null, "Customer deleted successfully", common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error(error);
            return base_response_1.BaseResponse.error("An error occurred while removing the customer", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCustomer(id) {
        try {
            const customer = await this.customerRepository.findOne({ where: { id: id } });
            if (!customer) {
                return base_response_1.BaseResponse.error(`Customer with ID ${id} not found`, null, common_1.HttpStatus.NOT_FOUND);
            }
            await this.customerRepository.delete(id);
            return base_response_1.BaseResponse.success(null, 'Customer deleted successfully', common_1.HttpStatus.NO_CONTENT);
        }
        catch (error) {
            return base_response_1.BaseResponse.error(error.message || 'Error deleting customer', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map