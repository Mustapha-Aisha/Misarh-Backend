export declare class Configuration {
    private readonly logger;
    readonly CREATE_USER_QUEUE = "create-user";
    readonly REDIS_URL: string;
    readonly VERIFICATION_TYPE = "sms";
    readonly RESET_PASSWORD_QUEUE = "reset-password";
    readonly DATABASE_LOGGING: boolean;
    readonly DATABASE_HOST: string;
    readonly DATABASE_PORT: number;
    readonly DATABASE_NAME: string;
    readonly DATABASE_USER: string;
    readonly DATABASE_PASSWORD: string;
    readonly JWT_SECRET: string;
    readonly JWT_EXPIRATION: number;
    readonly DATABASE_SYNC: boolean;
    readonly PORT: number;
    readonly CORS_ALLOWED_ORIGIN: string;
    readonly IS_PRODUCTION: boolean;
    readonly REDIS_HOST: string;
    readonly REDIS_PORT: number;
    readonly REDIS_USERNAME: string;
    readonly REDIS_PASSWORD: string;
    readonly CACHE_TTL: number;
    readonly PAYSTACK_SECRET_KEY: string;
    constructor();
}
export declare const Config: Configuration;
