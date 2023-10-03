import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, ModuleRef } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import vi from 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import firebaseAdmin from 'firebase-admin';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { dataSource } from '../../data-source';
import { AuthModule } from '../auth/auth.module';
import appConfig, {
  AppConfig,
  appConfigValidationSchema,
} from '../common/config/app.config';
import { bullOptions } from '../common/config/bull.config';
import { redisConfig } from '../common/config/redis.config';
import { TIME_ZONE } from '../common/constants/global.constant';
import { AppEnvironment } from '../common/enums/app.enum';
import { AllExceptionsFilter } from '../common/filters/all.filter';
import { ContactModule } from '../contact/contact.module';
import { FileModule } from '../file/file.module';
import { HealthModule } from '../health/health.module';
import { NewsModule } from '../news/news.module';
import { SubjectModule } from '../subject/subject.module';
import { UtilsModule } from '../utils/utils.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [
    BullModule.forRootAsync(bullOptions),
    RedisModule.forRootAsync(redisConfig),
    EventEmitterModule.forRoot({
      maxListeners: 20,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => appConfig],
      cache: true,
      validationSchema: appConfigValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: { path: path.join(__dirname, '..', 'i18n'), watch: true },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), 'src/i18n/i18n.generated.ts'),
      logging: false,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    HttpModule,

    UtilsModule,
    AuthModule,
    FileModule,
    SubjectModule,
    NewsModule,
    ContactModule,
    HealthModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { exposeDefaultValues: true },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private configService: ConfigService<AppConfig>,
    private moduleRef: ModuleRef,
  ) {}

  //trigger cicd
  async onModuleInit() {
    await dataSource.query('CREATE extension IF NOT EXISTS pgcrypto');
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    dayjs.locale(vi);
    dayjs.tz.setDefault(TIME_ZONE);
    dayjs.extend(customParseFormat);
    dayjs.extend(duration);

    Error.stackTraceLimit = 2;

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        privateKey: this.configService
          .get<string>('firebase.privateKey')
          .replace(/\\n/gm, '\n'),
        clientEmail: this.configService.get('firebase.clientEmail'),
        projectId: this.configService.get('firebase.projectId'),
      } as Partial<firebaseAdmin.ServiceAccount>),
    });

    const isLocalOrTest = [AppEnvironment.LOCAL, AppEnvironment.TEST].includes(
      this.configService.get('environment'),
    );

    if (isLocalOrTest) return;
  }
}
