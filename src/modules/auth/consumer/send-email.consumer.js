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
var SendEmailConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("../../../libs/config");
let SendEmailConsumer = SendEmailConsumer_1 = class SendEmailConsumer {
    constructor() {
        this.logger = new common_1.Logger(SendEmailConsumer_1.name);
    }
    async transcode(job) {
        this.logger.debug('Started processing send email queue');
        console.log(job.data['user']);
        this.logger.debug('Finished processing send email queue');
    }
};
exports.SendEmailConsumer = SendEmailConsumer;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SendEmailConsumer.prototype, "transcode", null);
exports.SendEmailConsumer = SendEmailConsumer = SendEmailConsumer_1 = __decorate([
    (0, bull_1.Processor)(config_1.Config.CREATE_USER_QUEUE),
    __metadata("design:paramtypes", [])
], SendEmailConsumer);
//# sourceMappingURL=send-email.consumer.js.map