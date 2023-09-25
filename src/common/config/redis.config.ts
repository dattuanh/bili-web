import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { AppEnvironment } from '../enums/app.enum';
import appConfig, { AppConfig } from './app.config';

export enum RedisNamespace {
  MASTER_NS = 'MASTER_NS',
  SLAVE_NS = 'SLAVE_NS',
}

export const redisConfig: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory(configService: ConfigService<AppConfig>) {
    const sentinelsConfig =
      configService.get<typeof appConfig.redis.sentinels>('redis.sentinels');
    const sentinels = sentinelsConfig.map((item) => ({
      host: item.host,
      port: Number(item.port),
    }));
    const sentinelPassword = configService.get('redis.sentinelPassword');
    const password = configService.get('redis.password');
    const groupName = configService.get('redis.redisGroupName');
    const redisHost = configService.get('redis.standAlone.host');
    const redisPort = configService.get('redis.standAlone.port');

    let redisConfig: RedisModuleOptions = {
      readyLog: true,
      errorLog: true,
    };

    switch (configService.get('environment')) {
      case AppEnvironment.LOCAL:
        redisConfig = {
          ...redisConfig,
          commonOptions: { host: redisHost, port: Number(redisPort), password },
          config: [
            { role: 'master', namespace: RedisNamespace.MASTER_NS },
            { role: 'slave', namespace: RedisNamespace.SLAVE_NS },
          ],
        };
        break;
      case AppEnvironment.TEST:
        redisConfig = {
          ...redisConfig,
          commonOptions: { host: 'localhost', port: 6379 },
          config: [
            { role: 'master', namespace: RedisNamespace.MASTER_NS },
            { role: 'slave', namespace: RedisNamespace.SLAVE_NS },
          ],
        };
        break;
      default:
        redisConfig = {
          commonOptions: {
            sentinels,
            password,
            sentinelPassword,
            name: groupName,
          },
          config: [
            { role: 'master', namespace: RedisNamespace.MASTER_NS },
            { role: 'slave', namespace: RedisNamespace.SLAVE_NS },
          ],
        };
    }

    return redisConfig;
  },
};
