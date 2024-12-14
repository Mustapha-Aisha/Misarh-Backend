"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm = require("typeorm");
const dotenv_1 = require("dotenv");
const config_1 = require("../../../../../Desktop/backend-server/src/libs/config");
(0, dotenv_1.config)();
console.log('====================================');
console.log(config_1.Config.IS_PRODUCTION);
console.log('====================================');
exports.default = new typeorm.DataSource({
    type: 'postgres',
    host: config_1.Config.DATABASE_HOST,
    port: config_1.Config.DATABASE_PORT,
    database: config_1.Config.DATABASE_NAME,
    username: config_1.Config.DATABASE_USER,
    password: config_1.Config.DATABASE_PASSWORD,
    synchronize: config_1.Config.DATABASE_SYNC,
    logging: config_1.Config.DATABASE_LOGGING,
    migrations: ['src/libs/db/migrations/*{.ts,.js}'],
    ssl: config_1.Config.IS_PRODUCTION ? { rejectUnauthorized: false } : null,
});
//# sourceMappingURL=typeOrm.config.js.map