import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check';
import { HealthService } from '../services/health.service';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(private readonly healthSer: HealthService) {}

  @Get('liveness')
  @HealthCheck()
  async checkLiveness(): Promise<HealthCheckResult> {
    return this.healthSer.checkLiveness();
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness(): Promise<HealthCheckResult> {
    return this.healthSer.checkReadiness();
  }
}
