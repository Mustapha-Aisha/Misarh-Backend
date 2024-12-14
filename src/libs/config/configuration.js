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
exports.Config = exports.Configuration = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const dotenv_1 = require("dotenv");
const process = require("node:process");
(0, dotenv_1.config)();
class Configuration {
    constructor() {
        this.logger = new common_1.Logger(Configuration.name);
        this.CREATE_USER_QUEUE = 'create-user';
        this.REDIS_URL = process.env.REDIS_URL;
        this.VERIFICATION_TYPE = 'sms';
        this.RESET_PASSWORD_QUEUE = 'reset-password';
        this.DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true';
        this.DATABASE_HOST = process.env.DATABASE_HOST;
        this.DATABASE_PORT = Number(process.env.DATABASE_PORT);
        this.DATABASE_NAME = process.env.DATABASE_NAME;
        this.DATABASE_USER = process.env.DATABASE_USER;
        this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);
        this.DATABASE_SYNC = process.env.DATABASE_SYNC === 'true';
        this.PORT = Number(process.env.PORT);
        this.CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN;
        this.IS_PRODUCTION = process.env.NODE_ENV !== 'development';
        this.REDIS_HOST = process.env.REDIS_HOST;
        this.REDIS_PORT = Number(process.env.REDIS_PORT);
        this.REDIS_USERNAME = process.env.REDIS_USERNAME;
        this.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
        this.CACHE_TTL = Number(process.env.CACHE_TTL);
        this.PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        const error = (0, class_validator_1.validateSync)(this);
        if (!error.length)
            return;
        this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
        process.exit(1);
    }
}
exports.Configuration = Configuration;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CREATE_USER_QUEUE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "VERIFICATION_TYPE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "RESET_PASSWORD_QUEUE", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_LOGGING", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_HOST", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "JWT_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], Configuration.prototype, "JWT_EXPIRATION", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DATABASE_SYNC", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], Configuration.prototype, "PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CORS_ALLOWED_ORIGIN", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], Configuration.prototype, "IS_PRODUCTION", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_HOST", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_USERNAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CACHE_TTL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "PAYSTACK_SECRET_KEY", void 0);
exports.Config = new Configuration();
//# sourceMappingURL=configuration.js.map