"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_transaction_reference = exports.generateUniqueIdFromName = exports.generateVerificationCode = exports.handleErrorCatch = void 0;
const common_1 = require("@nestjs/common");
const handleDbErrors = (err) => {
    if (err.number === 547) {
        throw new common_1.BadRequestException('Invalid Foreign Key');
    }
    else if (err.number === 2627 || err.number === 2601) {
        throw new common_1.BadRequestException('DB duplicate error value already exists');
    }
};
const handleErrorCatch = (err, source) => {
    handleDbErrors(err);
    if (err.status === common_1.HttpStatus.NOT_FOUND ||
        err.status === common_1.HttpStatus.BAD_REQUEST ||
        err.status === common_1.HttpStatus.UNAUTHORIZED ||
        err.status === common_1.HttpStatus.FORBIDDEN ||
        err.status === common_1.HttpStatus.CONFLICT) {
        throw new common_1.HttpException({
            status: err.status,
            error: err.response.message || err.response.error,
        }, err.status);
    }
};
exports.handleErrorCatch = handleErrorCatch;
const generateVerificationCode = (environment) => {
    if (environment.toLowerCase() === 'production') {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
    else {
        return '1234';
    }
};
exports.generateVerificationCode = generateVerificationCode;
const generateUniqueIdFromName = (name) => {
    const names = name.split(' ').filter((n) => n.length > 0);
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    const formattedInitials = initials.length > 3 ? initials.substring(0, 3) : initials;
    return `${formattedInitials}-${randomNumber}`;
};
exports.generateUniqueIdFromName = generateUniqueIdFromName;
const generate_transaction_reference = () => {
    try {
        const maxDigits = 10;
        let digits = 'Ref';
        for (let i = 0; i < maxDigits; i++) {
            digits += Math.floor(Math.random() * 10).toString();
        }
        return digits;
    }
    catch (error) {
        console.error('Error generating transaction reference:', error);
        return '';
    }
};
exports.generate_transaction_reference = generate_transaction_reference;
//# sourceMappingURL=utils.js.map