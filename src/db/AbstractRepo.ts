import {
  EntityTarget,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './BaseEntity';
import { readConnection, writeConnection } from './DatabaseModule';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractRepo<T extends BaseEntity> {
  protected constructor(protected readonly entityTarget: EntityTarget<T>) {}

  async save(entity: T): Promise<T> {
    return writeConnection.manager
      .getRepository(this.entityTarget)
      .save(entity);
  }

  async saveMany(entities: T[]): Promise<T[]> {
    return writeConnection.manager
      .getRepository(this.entityTarget)
      .save(entities);
  }

  async exists(where: FindOptionsWhere<T>) {
    const res = await readConnection
      .getRepository(this.entityTarget)
      .findOne({ where });

    return !!res === true;
  }

  //update
  async update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: (keyof T)[],
  ): Promise<T | null> {
    const repository = readConnection.getRepository(this.entityTarget);
    // console.log('Repository:', repository); // Debugging line

    const metadata = repository.metadata;
    const hasDeletedAtColumn = metadata.columns.some(
      (column) =>
        column.propertyName === 'is_deleted' ||
        column.databaseName === 'is_deleted',
    );
    const options: FindOneOptions<T> = {
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
    // console.log('Options:', options); // Debugging line

    return repository.findOne(options);
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async findPaginated(
    pageSize?: number,
    currentPage?: number,
    where?: Record<string, any>,
    order?: Record<string, any>,
    relations?: FindOptionsRelations<T>,
  ) {
    pageSize = pageSize ? pageSize : 10;
    currentPage = currentPage ? currentPage : 1;
    const offset = (currentPage - 1) * pageSize;

    const res = await readConnection
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
          delete item['user'].password; // Remove password from user relation
        }
      });
    }
    //if user exists in the data, remove password from the user object
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

  async find(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    order: Record<string, any> = {},
    relations?: FindOptionsRelations<T>,
  ) {
    const repository = readConnection.getRepository(this.entityTarget);
    const metadata = repository.metadata;
    const hasDeletedAtColumn = metadata.columns.some(
      (column) =>
        column.propertyName === 'is_deleted' ||
        column.databaseName === 'is_deleted',
    );
    let updatedWhere: FindOptionsWhere<T>[] | FindOptionsWhere<T>;

    if (hasDeletedAtColumn) {
      // If the where condition is an array, apply the 'is_deleted' condition to each
      if (Array.isArray(where)) {
        updatedWhere = where.map((condition) => ({
          ...condition,
          is_deleted: false,
        }));
      } else {
        // Apply the 'is_deleted' condition directly
        updatedWhere = {
          ...where,
          is_deleted: false,
        };
      }
    } else {
      updatedWhere = where;
    }

    // Fetch the results from the database
    const results = await repository.find({
      where: updatedWhere,
      order,
      relations,
    });

    // Remove the 'password' field if 'user' object is present
    results.forEach((result: any) => {
      if (result.user && result.user.password) {
        delete result.user.password;
      }
    });
    return results;
  }

  //findOne By multiple conditions
  async findOneByMultipleConditions(
    where: FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T>,
  ) {
    return readConnection.getRepository(this.entityTarget).findOne({
      where,
      relations,
    });
  }

  //find one
  async findOneOrFail(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ) {
    return await readConnection
      .getRepository(this.entityTarget)
      .findOneOrFail({ where, relations });
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    const res = await writeConnection.manager
      .getRepository(this.entityTarget)
      .delete(where);

    return {
      status: !!res.affected,
    };
  }

  async search(
    keyword: string,
    columns: string[],
    entityName: string,
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    try {
      const queryBuilder = readConnection
        .getRepository(this.entityTarget)
        .createQueryBuilder(entityName);

      // Convert both the column values and the search term to lowercase
      const whereConditions = columns.map(
        (column) => `LOWER(${entityName}.${column}) LIKE :term`,
      );

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
    } catch (error) {
      throw error;
    }
  }


  async searchWithOutPagination(
    keyword: string,
    columns: string[],
    entityName: string,
  ) {
    try {
      const queryBuilder = readConnection
        .getRepository(this.entityTarget)
        .createQueryBuilder(entityName);

      const whereConditions = columns.map(
        (column) => `${entityName}.${column} LIKE :term`,
      );

      const [data] = await queryBuilder
        .where(`(${whereConditions.join(' OR ')})`, { term: `%${keyword}%` })
        .getManyAndCount();

      return data;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      const res = await readConnection.getRepository(this.entityTarget).count();

      return res;
    } catch (error) {
      throw error;
    }
  }

  async countWhere(where?: FindOptionsWhere<T>) {
    try {
      return await readConnection.getRepository(this.entityTarget).count({
        where,
      });
    } catch (error) {
      throw error;
    }
  }

  async countWhereIn(
    where: FindOptionsWhere<T>,
    columnName: string,
    values: any[],
  ) {
    try {
      return await readConnection
        .getRepository(this.entityTarget)
        .count({ where: { ...where, [columnName]: In(values) } });
    } catch (error) {
      throw error;
    }
  }

  //fetch all
  async fetchAll() {
    return readConnection.getRepository(this.entityTarget).find();
  }

  async sumWithConditions(
    columnName: string,
    where?: FindOptionsWhere<T>,
  ): Promise<number> {
    const queryBuilder = readConnection
      .getRepository(this.entityTarget)
      .createQueryBuilder();
    const sum = await queryBuilder
      .select(`SUM(${columnName})`, 'sum')
      .where(where)
      .getRawOne();
    return sum.sum || 0;
  }

  async findPost(
    pageSize?: number,
    currentPage?: number,
    where?: Record<string, any>,
    order?: Record<string, any>,
    relations?: FindOptionsRelations<T>,
    top: boolean = false,
    user_id?: string,
  ): Promise<{
    data: T[];
    pagination?: { total: number; pageSize: number; currentPage: number };
  }> {
    pageSize = pageSize || 10;
    currentPage = currentPage || 1;
    const offset = (currentPage - 1) * pageSize;

    const repository = readConnection.getRepository(this.entityTarget);
    const tableName = repository.metadata.tableName;
    const queryBuilder = repository.createQueryBuilder(tableName);
    queryBuilder.where(`${tableName}.is_deleted = :is_deleted`, { is_deleted: false });
    // Apply where conditions (if provided)
    if (where) {
      queryBuilder.where(where);
    }

    // Apply sorting (if provided)
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
      // queryBuilder
      //   .leftJoin('post_likes', 'pl', `${tableName}.id = pl.post_id`)
      //   .leftJoinAndSelect(`${tableName}.images`, 'images')
      //   .leftJoinAndSelect(`${tableName}.user`, 'user')
      //   .groupBy(`${tableName}.id`)
      //   .addGroupBy('pl.post_id')
      //   .addGroupBy('images.id') // Ensure images columns are included in the GROUP BY clause
      //   .addGroupBy('user.id') // Ensure user columns are included in the GROUP BY clause
      //   .addGroupBy('images.created_at') // Include additional image columns if needed
      //   .addGroupBy('user.updated_at') // Include additional image columns if needed
      //   .addGroupBy('user.created_at') // Include additional image columns if needed
      //   .having('COUNT(pl.post_id) > :likesThreshold', { likesThreshold: -1 }); // Adjust threshold as needed
    }

    // Handle nested relations eager loading
    if (relations) {
      Object.keys(relations).forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`${tableName}.${relation}`, relation);
        if (relations[relation] && typeof relations[relation] === 'object') {
          Object.keys(relations[relation]).forEach((nestedRelation) => {
            queryBuilder.leftJoinAndSelect(
              `${relation}.${nestedRelation}`,
              nestedRelation,
            );
          });
        }
      });
    }
    queryBuilder
      .loadRelationCountAndMap(`${tableName}.likeCount`, `${tableName}.likes`)
      .loadRelationCountAndMap(
        `${tableName}.commentCount`,
        `${tableName}.comments`,
      )
      .loadRelationCountAndMap(
        `${tableName}.shareCount`,
        `${tableName}.views`,
        'shares',
        (qb) => qb.where('shares.type = :type', { type: 'share' }),
      )
      .loadRelationCountAndMap(
        `${tableName}.viewCount`,
        `${tableName}.views`,
        'views',
        (qb) => qb.where('views.type = :type', { type: 'view' }),
      );

    const total = await queryBuilder.getCount();
    queryBuilder.skip(offset).take(pageSize);
    const data = await queryBuilder.getMany();

    // const [data, total] = await queryBuilder
    //   .where(`${tableName}.is_deleted = :is_deleted`, { is_deleted: false })
    //   .skip(offset)
    //   .take(pageSize)
    //   .getManyAndCount();

    if (!data.length) {
      return {
        data: [],
      };
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const ids = data.map((post) => post.id);
    //check if user has liked the post
    //select from post_likes where user_id = user_id and post_id in (ids)
    const likedAndViewedPosts = await readConnection
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
        likedMap.get((post as unknown as { id: string }).id)?.is_liked || false;
      post['is_shared'] = likedMap.get((post as unknown as { id: string }).id)?.is_shared || false;
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
