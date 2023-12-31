import * as dotenv from 'dotenv';
import joi from 'joi';
import { AppEnvironment } from '../enums/app.enum';
import { RecursiveKeyOf } from '../types/utils.type';
dotenv.config();

const appConfig = {
  environment: process.env.NODE_ENV,
  port: +process.env.PORT || 5000,
  // feMerchantBaseUrl: process.env.FE_MERCHANT_BASE_URL,
  // feCustomerBaseUrl: process.env.FE_CUSTOMER_BASE_URL,
  databaseSecretKey: process.env.DATABASE_SECRET_KEY,
  cronSecret: process.env.CRON_SECRET,

  redis: {
    standAlone: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    sentinels:
      process.env.REDIS_SENTINELS?.split('|')?.map((item) => {
        const [host, port] = item?.split(':') || [];
        return { host, port };
      }) || [],
    password: process.env.REDIS_PASSWORD,
    sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD,
    redisGroupName: 'mymaster',
  },

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,

    s3: {
      domain: process.env.AWS_S3_DOMAIN,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      limitSizeMb: +process.env.AWS_S3_LIMIT_SIZE_MB,
      presignTimeOut: +process.env.AWS_S3_PRESIGN_TIME_OUT,
    },
  },

  firebase: {
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },

  vietGuys: {
    baseUrl: process.env.VIET_GUYS_BASE_URL,
    cskhSmsUrl: process.env.VIET_GUYS_CSKH_SMS_URL,
  },

  sendgrid: {
    apiKey: process.env.SEND_GRID_KEY,
    sender: process.env.SEND_GRID_SENDER_KEY,
    branchName: process.env.SEND_GRID_BRANCH_NAME,
    templateId: {
      verifyRegisterMerchant:
        process.env.SEND_GRID_TEMPLATE_VERIFY_REGISTER_MERCHANT_ID,
    },
  },
};

export default appConfig;
export type AppConfig = Record<RecursiveKeyOf<typeof appConfig>, string>;

export const appConfigValidationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid(...Object.values(AppEnvironment))
    .required(),
  PORT: joi.number().required(),
  // FE_MERCHANT_BASE_URL: joi.string().required(),
  // FE_CUSTOMER_BASE_URL: joi.string().required(),
  CRON_SECRET: joi.string().required(),

  DATABASE_SECRET_KEY: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_DATABASE: joi.string().required(),

  REDIS_PASSWORD: joi.string().required(),

  AUTH_JWT_ACCESS_TOKEN_KEY: joi.string().required(),
  AUTH_JWT_ACCESS_TOKEN_EXPIRE: joi.string().required(),
  AUTH_JWT_REFRESH_TOKEN_KEY: joi.string().required(),
  AUTH_JWT_REFRESH_TOKEN_EXPIRE: joi.string().required(),

  AWS_ACCESS_KEY_ID: joi.string().required(),
  AWS_SECRET_ACCESS_KEY: joi.string().required(),
  AWS_REGION: joi.string().required(),
  AWS_S3_DOMAIN: joi.string().required(),
  AWS_S3_BUCKET_NAME: joi.string().required(),
  AWS_S3_LIMIT_SIZE_MB: joi.string().required(),
  AWS_S3_PRESIGN_TIME_OUT: joi.string().required(),

  FIREBASE_PRIVATE_KEY: joi.string().required(),
  FIREBASE_CLIENT_EMAIL: joi.string().required(),
  FIREBASE_PROJECT_ID: joi.string().required(),

  SEND_GRID_KEY: joi.string().required(),
  SEND_GRID_SENDER_KEY: joi.string().required(),
  SEND_GRID_BRANCH_NAME: joi.string().required(),
  SEND_GRID_TEMPLATE_VERIFY_REGISTER_MERCHANT_ID: joi.string().required(),
});
