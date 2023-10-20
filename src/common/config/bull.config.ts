import { SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
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
