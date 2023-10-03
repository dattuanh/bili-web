import { Global, Module } from '@nestjs/common';
import { CustomerRouteService } from './services/customer-route.service';
import { EncryptService } from './services/encrypt.service';
import { RedisKeyService } from './services/redis-key.service';
import { SendGridService } from './services/send-grid.service';
import { UtilService } from './services/util.service';
import { UuidService } from './services/uuid.service';

@Global()
@Module({
  providers: [
    UuidService,
    EncryptService,
    UtilService,
    SendGridService,
    RedisKeyService,
    CustomerRouteService,
  ],
  exports: [
    UuidService,
    EncryptService,
    UtilService,
    SendGridService,
    RedisKeyService,
    CustomerRouteService,
  ],
})
export class UtilsModule {}
