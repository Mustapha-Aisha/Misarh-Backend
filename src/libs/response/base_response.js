"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
const common_1 = require("@nestjs/common");
class BaseResponse {
    constructor(success, status_code, message, data) {
        this.success = success;
        this.status_code =
            status_code || (success ? common_1.HttpStatus.OK : common_1.HttpStatus.BAD_REQUEST);
        this.message = message;
        if (data !== null && data !== undefined) {
            this.data = data;
        }
    }
    static success(data, message, status_code) {
        return new BaseResponse(true, status_code, message, data);
    }
    static error(message, data, status_code) {
        throw new common_1.HttpException({ status_code, message }, status_code);
    }
}
exports.BaseResponse = BaseResponse;
//# sourceMappingURL=base_response.js.map