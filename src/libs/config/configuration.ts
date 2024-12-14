import { Logger } from '@nestjs/common';
import { IsBoolean, IsInt, IsString, validateSync } from 'class-validator';

import { config } from 'dotenv';
import * as process from 'node:process';
config();

export class Configuration {
  private readonly logger = new Logger(Configuration.name);
  //CONSTANTS

  @IsString()
  readonly CREATE_USER_QUEUE = 'create-user';

  @IsString()
  readonly REDIS_URL = process.env.REDIS_URL;


  @IsString()
  readonly VERIFICATION_TYPE = 'sms';

  @IsString()
  readonly RESET_PASSWORD_QUEUE = 'reset-password';

  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true';

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsInt()
  readonly JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === 'true';

  @IsInt()
  readonly PORT = Number(process.env.PORT);

  @IsString()
  readonly CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN;

  @IsBoolean()
  readonly IS_PRODUCTION = process.env.NODE_ENV !== 'development';

  @IsString()
  readonly REDIS_HOST = process.env.REDIS_HOST;

  @IsInt()
  readonly REDIS_PORT = Number(process.env.REDIS_PORT);

  @IsString()
  readonly REDIS_USERNAME = process.env.REDIS_USERNAME;

  @IsString()
  readonly REDIS_PASSWORD = process.env.REDIS_PASSWORD;

  @IsInt()
  readonly CACHE_TTL = Number(process.env.CACHE_TTL);

  @IsString()
  readonly PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  constructor() {
    const error = validateSync(this);

    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
