import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";


@Injectable()
export class DbTypeOrmConfigService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        // throw new Error("Method not implemented.");
        return {
            type: 'postgres',
            autoLoadEntities: true,
            logging:['error'] ,
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
}


