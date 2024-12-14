"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepo = void 0;
const typeorm_1 = require("typeorm");
const DatabaseModule_1 = require("./DatabaseModule");
const common_1 = require("@nestjs/common");
class AbstractRepo {
    constructor(entityTarget) {
        this.entityTarget = entityTarget;
    }
    async save(entity) {
        return DatabaseModule_1.writeConnection.manager
            .getRepository(this.entityTarget)
            .save(entity);
    }
    async saveMany(entities) {
        return DatabaseModule_1.writeConnection.manager
            .getRepository(this.entityTarget)
            .save(entities);
    }
    async exists(where) {
        const res = await DatabaseModule_1.readConnection
            .getRepository(this.entityTarget)
            .findOne({ where });
        return !!res === true;
    }
    async update(where, partialEntity) {
        const updateResult = await DatabaseModule_1.writeConnection.manager
            .getRepository(this.entityTarget)
            .update(where, partialEntity);
        if (!updateResult.affected) {
            console.warn('Entity not found with where', where);
            throw new common_1.NotFoundException('Entity not found.');
        }
        return this.findOne(where);
    }
    async findOne(where, relations, select) {
        const repository = DatabaseModule_1.readConnection.getRepository(this.entityTarget);
        const metadata = repository.metadata;
        const hasDeletedAtColumn = metadata.columns.some((column) => column.propertyName === 'is_deleted' ||
            column.databaseName === 'is_deleted');
        const options = {
            where,
            relations,
            select,
        };
        if (hasDeletedAtColumn) {
            options.where = {
                ...where,
                is_deleted: false,
            };
        }
        return repository.findOne(options);
    }
    async findOneAndUpdate(where, partialEntity) {
        const updateResult = await DatabaseModule_1.writeConnection.manager
            .getRepository(this.entityTarget)
            .update(where, partialEntity);
        if (!updateResult.affected) {
            console.warn('Entity not found with where', where);
            throw new common_1.NotFoundException('Entity not found.');
        }
        return this.findOne(where);
    }
    async findPaginated(pageSize, currentPage, where, order, relations) {
        pageSize = pageSize ? pageSize : 10;
        currentPage = currentPage ? currentPage : 1;
        const offset = (currentPage - 1) * pageSize;
        const res = await DatabaseModule_1.readConnection
            .getRepository(this.entityTarget)
            .findAndCount({
            take: pageSize,
            skip: offset,
            where,
            order,
            relations,
        });
        const [data, total] = res;
        if (!data.length) {
            return {
                data: [],
            };
        }
        if (relations && relations['user'] === true) {
            data.forEach((item) => {
                if (item['user'] && typeof item['user'] === 'object') {
                    delete item['user'].password;
                }
            });
        }
        if (data[0]['user'] && typeof data[0]['user'] === 'object') {
            data.forEach((item) => {
                delete item['user'].password;
            });
        }
        return {
            data,
            pagination: {
                total,
                pageSize,
                currentPage,
            },
        };
    }
    async find(where, order = {}, relations) {
        const repository = DatabaseModule_1.readConnection.getRepository(this.entityTarget);
        const metadata = repository.metadata;
        const hasDeletedAtColumn = metadata.columns.some((column) => column.propertyName === 'is_deleted' ||
            column.databaseName === 'is_deleted');
        let updatedWhere;
        if (hasDeletedAtColumn) {
            if (Array.isArray(where)) {
                updatedWhere = where.map((condition) => ({
                    ...condition,
                    is_deleted: false,
                }));
            }
            else {
                updatedWhere = {
                    ...where,
                    is_deleted: false,
                };
            }
        }
        else {
            updatedWhere = where;
        }
        const results = await repository.find({
            where: updatedWhere,
            order,
            relations,
        });
        results.forEach((result) => {
            if (result.user && result.user.password) {
                delete result.user.password;
            }
        });
        return results;
    }
    async findOneByMultipleConditions(where, relations) {
        return DatabaseModule_1.readConnection.getRepository(this.entityTarget).findOne({
            where,
            relations,
        });
    }
    async findOneOrFail(where, relations) {
        return await DatabaseModule_1.readConnection
            .getRepository(this.entityTarget)
            .findOneOrFail({ where, relations });
    }
    async findOneAndDelete(where) {
        const res = await DatabaseModule_1.writeConnection.manager
            .getRepository(this.entityTarget)
            .delete(where);
        return {
            status: !!res.affected,
        };
    }
    async search(keyword, columns, entityName, pageSize = 10, currentPage = 1) {
        try {
            const queryBuilder = DatabaseModule_1.readConnection
                .getRepository(this.entityTarget)
                .createQueryBuilder(entityName);
            const whereConditions = columns.map((column) => `LOWER(${entityName}.${column}) LIKE :term`);
            const offset = (currentPage - 1) * pageSize;
            const [data, total] = await queryBuilder
                .where(`(${whereConditions.join(' OR ')})`, { term: `%${keyword.toLowerCase()}%` })
                .skip(offset)
                .take(pageSize)
                .getManyAndCount();
            return {
                data,
                pagination: {
                    total,
                    pageSize,
                    currentPage,
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    async searchWithOutPagination(keyword, columns, entityName) {
        try {
            const queryBuilder = DatabaseModule_1.readConnection
                .getRepository(this.entityTarget)
                .createQueryBuilder(entityName);
            const whereConditions = columns.map((column) => `${entityName}.${column} LIKE :term`);
            const [data] = await queryBuilder
                .where(`(${whereConditions.join(' OR ')})`, { term: `%${keyword}%` })
                .getManyAndCount();
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async count() {
        try {
            const res = await DatabaseModule_1.readConnection.getRepository(this.entityTarget).count();
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    async countWhere(where) {
        try {
            return await DatabaseModule_1.readConnection.getRepository(this.entityTarget).count({
                where,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async countWhereIn(where, columnName, values) {
        try {
            return await DatabaseModule_1.readConnection
                .getRepository(this.entityTarget)
                .count({ where: { ...where, [columnName]: (0, typeorm_1.In)(values) } });
        }
        catch (error) {
            throw error;
        }
    }
    async fetchAll() {
        return DatabaseModule_1.readConnection.getRepository(this.entityTarget).find();
    }
    async sumWithConditions(columnName, where) {
        const queryBuilder = DatabaseModule_1.readConnection
            .getRepository(this.entityTarget)
            .createQueryBuilder();
        const sum = await queryBuilder
            .select(`SUM(${columnName})`, 'sum')
            .where(where)
            .getRawOne();
        return sum.sum || 0;
    }
    async findPost(pageSize, currentPage, where, order, relations, top = false, user_id) {
        pageSize = pageSize || 10;
        currentPage = currentPage || 1;
        const offset = (currentPage - 1) * pageSize;
        const repository = DatabaseModule_1.readConnection.getRepository(this.entityTarget);
        const tableName = repository.metadata.tableName;
        const queryBuilder = repository.createQueryBuilder(tableName);
        queryBuilder.where(`${tableName}.is_deleted = :is_deleted`, { is_deleted: false });
        if (where) {
            queryBuilder.where(where);
        }
        if (order) {
            queryBuilder.orderBy(order);
        }
        if (top) {
            queryBuilder
                .leftJoin('post_likes', 'pl', `${tableName}.id = pl.post_id`)
                .leftJoinAndSelect(`${tableName}.media`, 'media')
                .leftJoinAndSelect(`${tableName}.user`, 'user')
                .groupBy(`${tableName}.id`)
                .addGroupBy('media.id')
                .addGroupBy('user.id')
                .having('COUNT(pl.post_id) > :likesThreshold', { likesThreshold: -1 });
        }
        if (relations) {
            Object.keys(relations).forEach((relation) => {
                queryBuilder.leftJoinAndSelect(`${tableName}.${relation}`, relation);
                if (relations[relation] && typeof relations[relation] === 'object') {
                    Object.keys(relations[relation]).forEach((nestedRelation) => {
                        queryBuilder.leftJoinAndSelect(`${relation}.${nestedRelation}`, nestedRelation);
                    });
                }
            });
        }
        queryBuilder
            .loadRelationCountAndMap(`${tableName}.likeCount`, `${tableName}.likes`)
            .loadRelationCountAndMap(`${tableName}.commentCount`, `${tableName}.comments`)
            .loadRelationCountAndMap(`${tableName}.shareCount`, `${tableName}.views`, 'shares', (qb) => qb.where('shares.type = :type', { type: 'share' }))
            .loadRelationCountAndMap(`${tableName}.viewCount`, `${tableName}.views`, 'views', (qb) => qb.where('views.type = :type', { type: 'view' }));
        const total = await queryBuilder.getCount();
        queryBuilder.skip(offset).take(pageSize);
        const data = await queryBuilder.getMany();
        if (!data.length) {
            return {
                data: [],
            };
        }
        const ids = data.map((post) => post.id);
        const likedAndViewedPosts = await DatabaseModule_1.readConnection
            .getRepository('PostLikeEntity')
            .createQueryBuilder('pl')
            .select(['pl.post_id', 'pl.user_id'])
            .addSelect([
            `(SELECT COUNT(*) > 0 FROM post_likes WHERE post_id = pl.post_id AND user_id = :user_id) AS is_liked`,
            `(SELECT COUNT(*) > 0 FROM post_views WHERE post_id = pl.post_id AND user_id = :user_id AND type = 'share') AS is_shared`,
        ])
            .where('pl.post_id IN (:...ids)', { ids })
            .setParameter('user_id', user_id)
            .getRawMany();
        const likedMap = new Map();
        likedAndViewedPosts.forEach((row) => {
            likedMap.set(row.post_id, {
                is_liked: !!row.is_liked,
                is_shared: !!row.is_shared,
            });
        });
        data.forEach((post) => {
            post['is_liked'] =
                likedMap.get(post.id)?.is_liked || false;
            post['is_shared'] = likedMap.get(post.id)?.is_shared || false;
        });
        return {
            data,
            pagination: {
                total,
                pageSize,
                currentPage,
            },
        };
    }
}
exports.AbstractRepo = AbstractRepo;
//# sourceMappingURL=AbstractRepo.js.map