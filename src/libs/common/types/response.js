"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failed = exports.success = void 0;
const success = (data, message, meta) => {
    return {
        status: 'success',
        message: message || 'success',
        data,
        meta,
    };
};
exports.success = success;
const failed = (message, meta) => {
    return {
        status: 'failed',
        data: null,
        message: message || 'failed',
        meta,
    };
};
exports.failed = failed;
//# sourceMappingURL=response.js.map