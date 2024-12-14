import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { UNIT_OF_WORK_PROVIDER } from '../../../../../Desktop/backend-server/src/libs/constants';
import * as path from 'path';
import { types } from 'pg';
import { Config } from '../../../../../Desktop/backend-server/src/libs/config';
import { UserEntity } from '../../../../../Desktop/backend-server/src/modules/user/entity/user.entity';
import { CountryEntity } from '../../../../../Desktop/backend-server/src/modules/country/entity/country.entity';
import { StateEntity } from '../../../../../Desktop/backend-server/src/modules/state/entity/state.entity';
import { UserWalletEntity } from '../../../../../Desktop/backend-server/src/modules/user/entity/user-wallet.entity';
import { PostEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post.entity';
import { PostImageEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post-image-entity';
import { PostCommentEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post-comment-entity';
import { PostLikeEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post-like-entity';
import { PostViewEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post-view-entity';
import { PostSubCommentEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post-sub-comments.entity';
import { PostCommentLikeEntity } from '../../../../../Desktop/backend-server/src/modules/post/entity/post-comment-like.entity';
import { UserFriendEntity } from '../../../../../Desktop/backend-server/src/modules/user/entity/user_friends.entity';
import { LoungeEntity } from '../../../../../Desktop/backend-server/src/modules/tournament/entity/lounge.entity';
import { LoungeParticipantEntity } from '../../../../../Desktop/backend-server/src/modules/tournament/entity/lounge.participant.entity';
import { TournamentEntity } from '../../../../../Desktop/backend-server/src/modules/tournament/entity/tournament.entity';
import { TournamentParticipantEntity } from '../../../../../Desktop/backend-server/src/modules/tournament/entity/tournament-participant.entity';
import { TournamentContactEntity } from '../../../../../Desktop/backend-server/src/modules/tournament/entity/tournament-contact.entity';
import { GameTypeEntity } from '../../../../../Desktop/backend-server/src/modules/gametype/entity/gametype.entity';
import { UnitOfWork } from './UnitOfWork';

types.setTypeParser(20, 'text', parseInt);
types.setTypeParser(20, BigInt);

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly release: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly dataSource = new DataSource({
    type: 'postgres',
    entities: [
      UserEntity,
      CountryEntity,
      StateEntity,
      UserWalletEntity,
      PostEntity,
      PostImageEntity,
      PostCommentEntity,
      PostLikeEntity,
      PostViewEntity,
      PostSubCommentEntity,
      PostCommentLikeEntity,
      UserFriendEntity,
      LoungeEntity,
      LoungeParticipantEntity,
      TournamentEntity,
      TournamentParticipantEntity,
      TournamentContactEntity,
      GameTypeEntity
    ],
    migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
    logging: Config.DATABASE_LOGGING,
    host: Config.DATABASE_HOST,
    port: Config.DATABASE_PORT,
    database: Config.DATABASE_NAME,
    username: Config.DATABASE_USER,
    password: Config.DATABASE_PASSWORD,
    synchronize: false,
    extra: {
      trustServerCertificate: true,
    },
    ssl: false,
  });
  public async checkWriteConnection(): Promise<void> {
    if (this.dataSource.createQueryRunner().isReleased) {
      writeConnection = this.dataSource.createQueryRunner();
    }
  }

  async onModuleInit(): Promise<void> {
    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
    writeConnection = this.dataSource.createQueryRunner();
    readConnection = this.dataSource.manager;
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: UNIT_OF_WORK_PROVIDER,
      useClass: UnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK_PROVIDER],
})
export class DatabaseModule {}
