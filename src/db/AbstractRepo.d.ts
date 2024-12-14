import { EntityTarget, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './BaseEntity';
export declare abstract class AbstractRepo<T extends BaseEntity> {
    protected readonly entityTarget: EntityTarget<T>;
    protected constructor(entityTarget: EntityTarget<T>);
    save(entity: T): Promise<T>;
    saveMany(entities: T[]): Promise<T[]>;
    exists(where: FindOptionsWhere<T>): Promise<boolean>;
    update(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T>;
    findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>, select?: (keyof T)[]): Promise<T | null>;
    findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T>;
    findPaginated(pageSize?: number, currentPage?: number, where?: Record<string, any>, order?: Record<string, any>, relations?: FindOptionsRelations<T>): Promise<{
        data: any[];
        pagination?: undefined;
    } | {
        data: T[];
        pagination: {
            total: number;
            pageSize: number;
            currentPage: number;
        };
    }>;
    find(where: FindOptionsWhere<T>[] | FindOptionsWhere<T>, order?: Record<string, any>, relations?: FindOptionsRelations<T>): Promise<T[]>;
    findOneByMultipleConditions(where: FindOptionsWhere<T>[], relations?: FindOptionsRelations<T>): Promise<T>;
    findOneOrFail(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>): Promise<T>;
    findOneAndDelete(where: FindOptionsWhere<T>): Promise<{
        status: boolean;
    }>;
    search(keyword: string, columns: string[], entityName: string, pageSize?: number, currentPage?: number): Promise<{
        data: T[];
        pagination: {
            total: number;
            pageSize: number;
            currentPage: number;
        };
    }>;
    searchWithOutPagination(keyword: string, columns: string[], entityName: string): Promise<T[]>;
    count(): Promise<number>;
    countWhere(where?: FindOptionsWhere<T>): Promise<number>;
    countWhereIn(where: FindOptionsWhere<T>, columnName: string, values: any[]): Promise<number>;
    fetchAll(): Promise<T[]>;
    sumWithConditions(columnName: string, where?: FindOptionsWhere<T>): Promise<number>;
    findPost(pageSize?: number, currentPage?: number, where?: Record<string, any>, order?: Record<string, any>, relations?: FindOptionsRelations<T>, top?: boolean, user_id?: string): Promise<{
        data: T[];
        pagination?: {
            total: number;
            pageSize: number;
            currentPage: number;
        };
    }>;
}
