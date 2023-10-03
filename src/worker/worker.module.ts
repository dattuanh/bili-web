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
import { UserRepository } from '../auth/repositories/user.repository';
import appConfig, { AppConfig } from '../common/config/app.config';
import { bullOptions, bullQueues } from '../common/config/bull.config';
import { redisConfig } from '../common/config/redis.config';
import { TIME_ZONE } from '../common/constants/global.constant';
import { FileModule } from '../file/file.module';
import { FileRepository } from '../file/repositories/file.repository';
import { HealthModule } from '../health/health.module';
import { ImportProcessor } from './processors/import.processor';

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
    TypeOrmCustomModule.forFeature([UserRepository, FileRepository]),
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

    AuthModule,
    HealthModule,
    FileModule,
  ],
  providers: [ImportProcessor],
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
