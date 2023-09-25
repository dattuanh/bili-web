import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmCustomModule } from 'utility/dist';
import { AppConfig } from '../common/config/app.config';
import { bullQueues } from '../common/config/bull.config';
import { FileModule } from '../file/file.module';
import { FileRepository } from '../file/repositories/file.repository';
import { UtilsModule } from '../utils/utils.module';
import { AuthAdminController } from './controllers/admin/auth.admin.controller';
import { ProfileAdminController } from './controllers/admin/profile.admin.controller';
import { AdminRepository } from './repositories/admin.repository';
// import { UserGroupToUserRepository } from './repositories/user-group-to-user.repository';
// import { UserGroupRepository } from './repositories/user-group.repository';
import { UserRepository } from './repositories/user.repository';
import { AuthAdminService } from './services/admin/auth.admin.service';
import { ProfileAdminService } from './services/admin/profile.admin.service';
import { AuthCommonService } from './services/common/auth.common.service';
import { UserCommonService } from './services/common/user.common.service';
import { JwtAuthenAdminStrategy } from './strategies/jwt-authen.admin.strategy';
import { AuthenExternalStrategy } from './strategies/jwt-authen.external.strategy';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        secret: configService.get('auth.accessToken.secret'),
        signOptions: {
          algorithm: configService.get('auth.accessToken.algorithm'),
        },
      }),
    }),
    BullModule.registerQueue(...bullQueues),
    TypeOrmCustomModule.forFeature([
      UserRepository,
      AdminRepository,
      // UserGroupToUserRepository,
      // UserGroupRepository,
      FileRepository,
    ]),
    UtilsModule,
    forwardRef(() => FileModule),
  ],
  controllers: [
    AuthAdminController,
    // AdminAdminController,
    ProfileAdminController,
  ],
  providers: [
    JwtAuthenAdminStrategy,
    AuthenExternalStrategy,

    AuthAdminService,
    // AdminAdminService,
    ProfileAdminService,
    AuthCommonService,
    UserCommonService,
  ],
})
export class AuthModule {}
