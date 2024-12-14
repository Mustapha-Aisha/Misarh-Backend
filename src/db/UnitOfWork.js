"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitOfWork = void 0;
const DatabaseModule_1 = require("./DatabaseModule");
class UnitOfWork {
    async startTransaction(level) {
        level
            ? await DatabaseModule_1.writeConnection.startTransaction(level)
            : await DatabaseModule_1.writeConnection.startTransaction();
    }
    async commitTransaction() {
        await DatabaseModule_1.writeConnection.commitTransaction();
    }
    async rollbackTransaction() {
        await DatabaseModule_1.writeConnection.rollbackTransaction();
    }
    async complete(work) {
        try {
            await work();
            await this.commitTransaction();
        }
        catch (error) {
            await this.rollbackTransaction();
            throw error;
        }
    }
}
exports.UnitOfWork = UnitOfWork;
//# sourceMappingURL=UnitOfWork.js.map