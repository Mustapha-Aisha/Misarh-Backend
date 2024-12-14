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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const authentication_dto_1 = require("./dto/authentication.dto");
const public_strategy_1 = require("./strategy/public-strategy");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(createLoginDto) {
        return this.authService.login(createLoginDto);
    }
    async verifyAccountEmail(verifyAccountEmail) {
        return this.authService.verifyWithEmail(verifyAccountEmail);
    }
    async resetAccount(resetAccount) {
        return this.authService.resetAccount(resetAccount);
    }
    async changePassword(changePassword) {
        return this.authService.changePassword(changePassword);
    }
    async resendVerificationCode(data) {
        return this.authService.resendVerificationCode(data);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authentication_dto_1.CreateLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-account-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authentication_dto_1.VerifyCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyAccountEmail", null);
__decorate([
    (0, common_1.Post)('reset-account'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authentication_dto_1.ResetAccountDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetAccount", null);
__decorate([
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authentication_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('resend-verification-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authentication_dto_1.ResetAccountDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerificationCode", null);
exports.AuthController = AuthController = __decorate([
    (0, public_strategy_1.Public)(),
    (0, common_1.Controller)('auth/'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map