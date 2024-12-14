"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbTypeOrmConfigService = void 0;
const common_1 = require("@nestjs/common");
let DbTypeOrmConfigService = class DbTypeOrmConfigService {
    createTypeOrmOptions(connectionName) {
        return {
            type: 'postgres',
            autoLoadEntities: true,
            logging: ['error', 'query'],
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            database: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            synchronize: true,
            extra: {
                trustServerCertificate: true,
            },
            ssl: false,
        };
    }
};
exports.DbTypeOrmConfigService = DbTypeOrmConfigService;
exports.DbTypeOrmConfigService = DbTypeOrmConfigService = __decorate([
    (0, common_1.Injectable)()
], DbTypeOrmConfigService);
//# sourceMappingURL=db.config.js.map