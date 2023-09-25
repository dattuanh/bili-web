import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { RedisNamespace } from '../../common/config/redis.config';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@InjectRedis(RedisNamespace.MASTER_NS) private redis: Redis) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.redis.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        String(error),
        this.getStatus(key, false, error),
      );
    }
  }
}
