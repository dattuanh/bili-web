import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AppConfig } from '../../common/config/app.config';
import { RedisHealthIndicator } from '../indicators/redis-health.indicator';

@Injectable()
export class HealthService {
  constructor(
    private configSer: ConfigService<AppConfig>,
    private healthCheckSer: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private httpHealthIndicator: HttpHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private redisHealthIndicator: RedisHealthIndicator,
  ) {}

  async checkLiveness() {
    const appPort = Number(this.configSer.get('port'));

    return this.healthCheckSer.check([
      // error connect refuse
      // () => this.httpHealthIndicator.pingCheck('app', `http://[::1]:5000/`),
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 1000 * 1024 * 1024), //should not use more than 1000MB
    ]);
  }

  async checkReadiness() {
    return this.healthCheckSer.check([
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      () => this.redisHealthIndicator.isHealthy('redis'),
    ]);
  }
}
