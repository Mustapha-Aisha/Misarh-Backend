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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const base_response_1 = require("../../libs/response/base_response");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entity/user.entity");
const typeorm_2 = require("typeorm");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
const bull_1 = require("@nestjs/bull");
const config_1 = require("../../libs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const utils_1 = require("../../libs/common/helpers/utils");
let UserService = class UserService {
    constructor(userRepository, cacheManager, registrationQueue, jwtService) {
        this.userRepository = userRepository;
        this.cacheManager = cacheManager;
        this.registrationQueue = registrationQueue;
        this.jwtService = jwtService;
    }
    async createUser(data) {
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);
        data['user_id'] = (0, utils_1.generateUniqueIdFromName)(data.name);
        const user = await this.userRepository.save(data);
        if (!user) {
            throw new Error('User not created');
        }
        return base_response_1.BaseResponse.success(user, 'User created successfully', common_1.HttpStatus.CREATED);
    }
    async getMe(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        delete user.password;
        return base_response_1.BaseResponse.success(user, 'User fetched successfully', common_1.HttpStatus.OK);
    }
    async getUserById(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        return base_response_1.BaseResponse.success(user, 'User fetched successfully', common_1.HttpStatus.OK);
    }
    async updateUser(userId, data) {
        const user = await this.userRepository.update({ id: userId }, data);
        return base_response_1.BaseResponse.success(user, 'User updated successfully', common_1.HttpStatus.OK);
    }
    async deleteUser(userId) {
        try {
            await this.userRepository.update({ id: userId }, { is_deleted: true });
            return base_response_1.BaseResponse.success(null, 'User deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            console.log(error);
        }
    }
    async checkUserExist(id) {
        const user = await this.userRepository.findOne({
            where: { id: id }
        });
        return !!user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, ioredis_1.InjectRedis)()),
    __param(2, (0, bull_1.InjectQueue)(config_1.Config.CREATE_USER_QUEUE)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ioredis_2.Redis, Object, jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map