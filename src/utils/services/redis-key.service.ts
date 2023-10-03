import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../common/config/app.config';

@Injectable()
export class RedisKeyService {
  constructor(private configSer: ConfigService<AppConfig>) {}

  cacheKey() {
    return `${this.configSer.get('environment')}:CACHE`;
  }

  checkPasswordCountKey() {
    return `${this.configSer.get('environment')}:CHECK_PASSWORD_COUNT`;
  }

  loginCountKey(customerId: number) {
    return `${this.configSer.get('environment')}:LOGIN_COUNT:${customerId}`;
  }

  otpCountKey() {
    return `${this.configSer.get('environment')}:OTP_COUNT`;
  }

  otpThresholdKey(appCode: string, phoneNumber: string) {
    return `${this.configSer.get(
      'environment',
    )}:OTP_THRESHOLD:${appCode}:${phoneNumber}`;
  }
}
