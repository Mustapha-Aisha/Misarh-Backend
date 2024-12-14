import { EntityManager, EntityTarget, ObjectLiteral, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
interface WriteConnection {
    readonly startTransaction: (level?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE') => Promise<void>;
    readonly commitTransaction: () => Promise<void>;
    readonly rollbackTransaction: () => Promise<void>;
    readonly release: () => Promise<void>;
    readonly isTransactionActive: boolean;
    readonly manager: EntityManager;
}
interface ReadConnection {
    readonly getRepository: <T extends ObjectLiteral>(target: EntityTarget<T>) => Repository<T>;
    readonly query: (query: string) => Promise<void>;
    readonly createQueryBuilder: <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>, alias: string, queryRunner?: QueryRunner) => SelectQueryBuilder<Entity>;
}
export declare let writeConnection: WriteConnection;
export declare let readConnection: ReadConnection;
export declare class DatabaseModule {
}
export {};
