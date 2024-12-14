"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.readConnection = exports.writeConnection = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../../../../Desktop/backend-server/src/libs/constants");
const path = require("path");
const pg_1 = require("pg");
const config_1 = require("../../../../../Desktop/backend-server/src/libs/config");
const user_entity_1 = require("../../../../../Desktop/backend-server/src/modules/user/entity/user.entity");
const country_entity_1 = require("../../../../../Desktop/backend-server/src/modules/country/entity/country.entity");
const state_entity_1 = require("../../../../../Desktop/backend-server/src/modules/state/entity/state.entity");
const user_wallet_entity_1 = require("../../../../../Desktop/backend-server/src/modules/user/entity/user-wallet.entity");
const post_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post.entity");
const post_image_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post-image-entity");
const post_comment_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post-comment-entity");
const post_like_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post-like-entity");
const post_view_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post-view-entity");
const post_sub_comments_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post-sub-comments.entity");
const post_comment_like_entity_1 = require("../../../../../Desktop/backend-server/src/modules/post/entity/post-comment-like.entity");
const user_friends_entity_1 = require("../../../../../Desktop/backend-server/src/modules/user/entity/user_friends.entity");
const lounge_entity_1 = require("../../../../../Desktop/backend-server/src/modules/tournament/entity/lounge.entity");
const lounge_participant_entity_1 = require("../../../../../Desktop/backend-server/src/modules/tournament/entity/lounge.participant.entity");
const tournament_entity_1 = require("../../../../../Desktop/backend-server/src/modules/tournament/entity/tournament.entity");
const tournament_participant_entity_1 = require("../../../../../Desktop/backend-server/src/modules/tournament/entity/tournament-participant.entity");
const tournament_contact_entity_1 = require("../../../../../Desktop/backend-server/src/modules/tournament/entity/tournament-contact.entity");
const gametype_entity_1 = require("../../../../../Desktop/backend-server/src/modules/gametype/entity/gametype.entity");
const UnitOfWork_1 = require("./UnitOfWork");
pg_1.types.setTypeParser(20, 'text', parseInt);
pg_1.types.setTypeParser(20, BigInt);
exports.writeConnection = {};
exports.readConnection = {};
class DatabaseService {
    constructor() {
        this.dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            entities: [
                user_entity_1.UserEntity,
                country_entity_1.CountryEntity,
                state_entity_1.StateEntity,
                user_wallet_entity_1.UserWalletEntity,
                post_entity_1.PostEntity,
                post_image_entity_1.PostImageEntity,
                post_comment_entity_1.PostCommentEntity,
                post_like_entity_1.PostLikeEntity,
                post_view_entity_1.PostViewEntity,
                post_sub_comments_entity_1.PostSubCommentEntity,
                post_comment_like_entity_1.PostCommentLikeEntity,
                user_friends_entity_1.UserFriendEntity,
                lounge_entity_1.LoungeEntity,
                lounge_participant_entity_1.LoungeParticipantEntity,
                tournament_entity_1.TournamentEntity,
                tournament_participant_entity_1.TournamentParticipantEntity,
                tournament_contact_entity_1.TournamentContactEntity,
                gametype_entity_1.GameTypeEntity
            ],
            migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
            logging: config_1.Config.DATABASE_LOGGING,
            host: config_1.Config.DATABASE_HOST,
            port: config_1.Config.DATABASE_PORT,
            database: config_1.Config.DATABASE_NAME,
            username: config_1.Config.DATABASE_USER,
            password: config_1.Config.DATABASE_PASSWORD,
            synchronize: false,
            extra: {
                trustServerCertificate: true,
            },
            ssl: false,
        });
    }
    async checkWriteConnection() {
        if (this.dataSource.createQueryRunner().isReleased) {
            exports.writeConnection = this.dataSource.createQueryRunner();
        }
    }
    async onModuleInit() {
        await this.dataSource.initialize();
        if (!this.dataSource.isInitialized)
            throw new Error('DataSource is not initialized');
        exports.writeConnection = this.dataSource.createQueryRunner();
        exports.readConnection = this.dataSource.manager;
    }
    async onModuleDestroy() {
        await this.dataSource.destroy();
    }
}
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            DatabaseService,
            {
                provide: constants_1.UNIT_OF_WORK_PROVIDER,
                useClass: UnitOfWork_1.UnitOfWork,
            },
        ],
        exports: [constants_1.UNIT_OF_WORK_PROVIDER],
    })
], DatabaseModule);
//# sourceMappingURL=DatabaseModule.js.map