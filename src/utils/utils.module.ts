import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
// import { MerchantRepository } from '../auth/repositories/merchant.repository';
// import { UserTransactionLockRepository } from './repositories/user-transaction-lock.repository';
import { CustomerRouteService } from './services/customer-route.service';
import { EncryptService } from './services/encrypt.service';
import { RedisKeyService } from './services/redis-key.service';
import { SandboxService } from './services/sandbox.service';
import { SendGridService } from './services/send-grid.service';
import { UtilService } from './services/util.service';
import { UuidService } from './services/uuid.service';

@Global()
@Module({
  // imports: [
  //   HttpModule,
  //   // TypeOrmCustomModule.forFeature([
  //   //   // MerchantRepository,
  //   //   // UserTransactionLockRepository,
  //   // ]),
  // ],
  providers: [
    UuidService,
    EncryptService,
    UtilService,
    SendGridService,
    SandboxService,
    RedisKeyService,
    CustomerRouteService,
  ],
  exports: [
    UuidService,
    EncryptService,
    UtilService,
    SendGridService,
    SandboxService,
    RedisKeyService,
    CustomerRouteService,
  ],
})
export class UtilsModule {}
