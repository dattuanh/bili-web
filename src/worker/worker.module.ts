import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import firebaseAdmin from 'firebase-admin';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { TypeOrmCustomModule } from 'utility/dist';
import { dataSource } from '../../data-source';
import { AuthModule } from '../auth/auth.module';
// import { CustomerRepository } from '../auth/repositories/customer.repository';
// import { MerchantRepository } from '../auth/repositories/merchant.repository';
import { UserRepository } from '../auth/repositories/user.repository';
// import { CaslModule } from '../casl/casl.module';
import appConfig, { AppConfig } from '../common/config/app.config';
import { bullOptions, bullQueues } from '../common/config/bull.config';
import { redisConfig } from '../common/config/redis.config';
import { TIME_ZONE } from '../common/constants/global.constant';
// import { UserCreditRepository } from '../credit/repositories/user-credit.repository';
// import { UserHistoryCreditRepository } from '../credit/repositories/user-history-credit.repository';
// import { RequestExportRepository } from '../export/repositories/request-export.repositories';
// import { ExternalModule } from '../external/external.module';
// import { OutboxMessageRepository } from '../external/repositories/outbox-message.repository';
import { FileModule } from '../file/file.module';
import { FileRepository } from '../file/repositories/file.repository';
// import { GameModule } from '../game/game.module';
// import { GamePlayTimeRepository } from '../game/repositories/game-play-time.repository';
// import { GameTypeRepository } from '../game/repositories/game-type.repository';
// import { GameWinHistoryRepository } from '../game/repositories/game-win-history.repository';
// import { GameRepository } from '../game/repositories/game.repository';
import { HealthModule } from '../health/health.module';
// import { RequestImportRepository } from '../import/repositories/request-import.repository';
// import { LoyaltyCodeModule } from '../loyalty-code/loyalty-code.module';
// import { LoyaltyCodeGiftGameRepository } from '../loyalty-code/repositories/loyalty-code-gift-game.repository';
// import { LoyaltyCodeGiftProductRepository } from '../loyalty-code/repositories/loyalty-code-gift-product.repository';
// import { LoyaltyCodeGroupRepository } from '../loyalty-code/repositories/loyalty-code-group.repository';
// import { LoyaltyCodeJobRepository } from '../loyalty-code/repositories/loyalty-code-job.repository';
// import { LoyaltyCodeRepository } from '../loyalty-code/repositories/loyalty-code.repository';
// import { NotiModule } from '../noti/noti.module';
// import { NotiJobBatchRepository } from '../noti/repositories/noti-job-batch.repository';
// import { NotiJobRepository } from '../noti/repositories/noti-job.repository';
// import { NotiToUserRepository } from '../noti/repositories/noti-to-user.repository';
// import { NotiRepository } from '../noti/repositories/noti.repository';
// import { OrderModule } from '../order/order.module';
// import { OrderLineItemRepository } from '../order/repositories/order-line-item.repository';
// import { OrderRepository } from '../order/repositories/order.repository';
// import { UserEvoucherRepository } from '../order/repositories/user-evoucher.repository';
// import { UserHistoryPointRepository } from '../point/repositories/user-history-point.repository';
// import { ProductToVariantRepository } from '../product/repositories/product-to-variant.repository';
// import { ProductVariantRepository } from '../product/repositories/product-variant.repository';
// import { ProductRepository } from '../product/repositories/product.repository';
// import { ProvinceModule } from '../province/province.module';
// import { ReferralModule } from '../referral/referral.module';
// import { StatisticModule } from '../statistic/statistic.module';
// import { StoreModule } from '../store/store.module';
// import { SurveyModule } from '../survey/survey.module';
// import { SecretRepository } from '../system-config/repositories/secret.repository';
// import { UserFeedbackModule } from '../user-feedback/user-feedback.module';
import { CreateLoyaltyCodeJobProcessor } from './processors/create-loyalty-code-job.processor';
// import { ExportProcessor } from './processors/export.processor';
import { GamePlayTimeExpiryProcessor } from './processors/game-play-time-expiry.processor';
import { ImportProcessor } from './processors/import.processor';
import { NotiJobBatchProcessor } from './processors/noti-job-batch.processor';
import { NotiJobProcessor } from './processors/noti-job.processor';
// import { OutboxMessageProcessor } from './processors/outbox-message.processor';
import { UpdateLoyaltyCodeGroupProcessor } from './processors/update-loyalty-code-group.processor';
import { UserEvoucherProcessor } from './processors/user-evoucher.processor';

@Module({
  imports: [
    RedisModule.forRootAsync(redisConfig),
    BullModule.forRootAsync(bullOptions),
    BullModule.registerQueue(...bullQueues),
    EventEmitterModule.forRoot({
      maxListeners: 20,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => appConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    TypeOrmCustomModule.forFeature([
      // RequestExportRepository,
      // RequestImportRepository,
      // NotiRepository,
      // SecretRepository,
      // OutboxMessageRepository,
      // CustomerRepository,
      // OrderRepository,
      // OrderLineItemRepository,
      // ProductRepository,
      // GameWinHistoryRepository,
      // UserHistoryPointRepository,
      // NotiToUserRepository,
      UserRepository,
      // NotiJobRepository,
      // NotiJobBatchRepository,
      // LoyaltyCodeJobRepository,
      // LoyaltyCodeRepository,
      // UserEvoucherRepository,
      // MerchantRepository,
      // LoyaltyCodeGiftGameRepository,
      // LoyaltyCodeGiftProductRepository,
      // GameRepository,
      // GameTypeRepository,
      // ProductVariantRepository,
      // ProductToVariantRepository,
      // UserCreditRepository,
      // UserHistoryCreditRepository,
      FileRepository,
      // LoyaltyCodeGroupRepository,
      // GamePlayTimeRepository,
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: { path: path.join(__dirname, '..', 'i18n'), watch: true },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), '/src/i18n/i18n.generated.ts'),
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    HttpModule,

    // CaslModule,
    AuthModule,
    // SurveyModule,
    // ReferralModule,
    // NotiModule,
    // OrderModule,
    // StoreModule,
    // GameModule,
    // UserFeedbackModule,
    // StatisticModule,
    // ProvinceModule,
    // ExternalModule,
    HealthModule,
    FileModule,
    // LoyaltyCodeModule,
  ],
  providers: [
    // ExportProcessor,
    ImportProcessor,
    // OutboxMessageProcessor,
    NotiJobProcessor,
    NotiJobBatchProcessor,
    UpdateLoyaltyCodeGroupProcessor,
    CreateLoyaltyCodeJobProcessor,
    UserEvoucherProcessor,
    GamePlayTimeExpiryProcessor,
  ],
})
export class WorkerModule implements OnModuleInit {
  constructor(private configService: ConfigService<AppConfig>) {}

  async onModuleInit() {
    await dataSource.query('CREATE extension IF NOT EXISTS pgcrypto');
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(TIME_ZONE);
    dayjs.extend(customParseFormat);

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        privateKey: this.configService
          .get<string>('firebase.privateKey')
          .replace(/\\n/gm, '\n'),
        clientEmail: this.configService.get('firebase.clientEmail'),
        projectId: this.configService.get('firebase.projectId'),
      } as Partial<firebaseAdmin.ServiceAccount>),
    });
  }
}
