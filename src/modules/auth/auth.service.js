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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const base_response_1 = require("../../libs/response/base_response");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const utils_1 = require("../../libs/common/helpers/utils");
let AuthService = class AuthService {
    constructor(userRepository, cacheManager, jwtService) {
        this.userRepository = userRepository;
        this.cacheManager = cacheManager;
        this.jwtService = jwtService;
    }
    async verifyWithEmail(data) {
        const userId = await this.cacheManager.get(data.email);
        if (!userId) {
            return base_response_1.BaseResponse.error('Invalid code', null, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({ where: { email: data.email } });
        if (!user) {
            return base_response_1.BaseResponse.error('User not found', null, common_1.HttpStatus.NOT_FOUND);
        }
        if (data.type === 'REGISTER') {
            await this.userRepository.update({ id: user.id }, {
                email_verified_at: new Date(),
                is_email_verified: true,
            });
        }
        return base_response_1.BaseResponse.success(null, 'Email verified successfully', common_1.HttpStatus.OK);
    }
    async resendVerificationCode(data) {
        const user = await this.userRepository.findOne({
            where: { email: data.generic_data },
        });
        if (!user) {
            return base_response_1.BaseResponse.error('User not found', null, common_1.HttpStatus.NOT_FOUND);
        }
        const code = (0, utils_1.generateVerificationCode)();
        await this.cacheManager.set(user.email, code);
        return base_response_1.BaseResponse.success(null, 'Verification code sent successfully', common_1.HttpStatus.OK);
    }
    async resetAccount(data) {
        const user = await this.userRepository.findOne({
            where: { email: data.generic_data },
        });
        if (!user) {
            return base_response_1.BaseResponse.error('User not found', null, common_1.HttpStatus.NOT_FOUND);
        }
        const code = (0, utils_1.generateVerificationCode)();
        await this.cacheManager.set(user.email, code);
        return base_response_1.BaseResponse.success(null, 'Reset code sent successfully', common_1.HttpStatus.OK);
    }
    async changePassword(data) {
        const user = await this.userRepository.findOne({
            where: { email: data.email },
        });
        if (!user) {
            return base_response_1.BaseResponse.error('User not found', null, common_1.HttpStatus.NOT_FOUND);
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(data.password, salt);
        await this.userRepository.update({ id: user.id }, user);
        return base_response_1.BaseResponse.success(null, 'Password changed successfully', common_1.HttpStatus.OK);
    }
    async login(data) {
        const user = await this.userRepository.findOne({
            where: { email: data.email },
        });
        if (!user) {
            return base_response_1.BaseResponse.error('User not found', null, common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.is_email_verified) {
            return base_response_1.BaseResponse.error('Account not verified', null, common_1.HttpStatus.BAD_REQUEST);
        }
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            return base_response_1.BaseResponse.error('Invalid credentials', null, common_1.HttpStatus.BAD_REQUEST);
        }
        const access_token = this.jwtService.sign({ sub: user });
        delete user.password;
        return base_response_1.BaseResponse.success({ user, access_token }, 'Login successful', common_1.HttpStatus.OK);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        ioredis_2.default,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map