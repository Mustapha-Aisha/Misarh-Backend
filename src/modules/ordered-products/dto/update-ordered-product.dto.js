"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderedProductDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ordered_product_dto_1 = require("./create-ordered-product.dto");
class UpdateOrderedProductDto extends (0, mapped_types_1.PartialType)(create_ordered_product_dto_1.CreateOrderedProductDto) {
}
exports.UpdateOrderedProductDto = UpdateOrderedProductDto;
//# sourceMappingURL=update-ordered-product.dto.js.map