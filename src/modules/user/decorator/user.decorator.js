"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log("HELLO I'M REQUEST------:", request);
    return request.user?.sub || null;
});
//# sourceMappingURL=user.decorator.js.map