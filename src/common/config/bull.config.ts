import { BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { QueueName } from '../../worker/enums/worker.enum';
import { AppEnvironment } from '../enums/app.enum';
import appConfig, { AppConfig } from './app.config';

export const bullOptions: SharedBullAsyncConfiguration = {
  inject: [ConfigService],
  useFactory(configService: ConfigService<AppConfig>) {
    return {
      createClient(type, redisOpts: RedisOptions) {
        const opts: RedisOptions = {
          ...redisOpts,
          ...(type !== 'client'
            ? { enableReadyCheck: false, maxRetriesPerRequest: null }
            : {}),
        };

        const redisHost = configService.get('redis.standAlone.host');
        const redisPort = configService.get('redis.standAlone.port');
        const sentinelPassword = configService.get('redis.sentinelPassword');
        const password = configService.get('redis.password');
        const groupName = configService.get('redis.redisGroupName');
        const sentinelsConfig =
          configService.get<typeof appConfig.redis.sentinels>(
            'redis.sentinels',
          );
        const redisSentinels = sentinelsConfig?.map((item) => ({
          host: item.host,
          port: Number(item.port),
        }));

        let redisConfig: RedisOptions;

        switch (configService.get('environment')) {
          case AppEnvironment.LOCAL:
            redisConfig = {
              ...opts,
              host: redisHost,
              port: Number(redisPort),
              password,
            };
            break;
          case AppEnvironment.TEST:
            redisConfig = { ...opts, host: '127.0.0.1', port: 6379 };
            break;
          default:
            redisConfig = {
              ...opts,
              sentinels: redisSentinels,
              password,
              sentinelPassword,
              name: groupName,
            };
        }

        return new Redis(redisConfig);
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    };
  },
};

export const bullQueues: BullModuleOptions[] = [
  {
    name: QueueName.EXPORT,
    prefix: `{${QueueName.EXPORT}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.IMPORT,
    prefix: `{${QueueName.IMPORT}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.OUTBOX_MESSAGE,
    prefix: `{${QueueName.OUTBOX_MESSAGE}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.NOTI_JOB,
    prefix: `{${QueueName.NOTI_JOB}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.NOTI_JOB_BATCH,
    prefix: `{${QueueName.NOTI_JOB_BATCH}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.CREATE_LOYALTY_CODE_JOB,
    prefix: `{${QueueName.CREATE_LOYALTY_CODE_JOB}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.UPDATE_LOYALTY_CODE_GROUP,
    prefix: `{${QueueName.UPDATE_LOYALTY_CODE_GROUP}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.USER_EVOUCHER,
    prefix: `{${QueueName.USER_EVOUCHER}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
  {
    name: QueueName.GAME_PLAY_TIME_EXPIRY,
    prefix: `{${QueueName.GAME_PLAY_TIME_EXPIRY}}`,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  },
];
