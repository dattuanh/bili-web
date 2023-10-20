import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-http-header-strategy';
import { AppConfig } from 'src/common/config/app.config';
import { StrategyName } from '../constants/index.constant';

@Injectable()
export class AuthenExternalStrategy extends PassportStrategy(
  Strategy,
  StrategyName.EXTERNAL,
) {
  private dbSecretKey: string;
  constructor(configService: ConfigService<AppConfig>) {
    super({} as IStrategyOptions);

    this.dbSecretKey = configService.get('databaseSecretKey');
  }
}

interface StrategyOptions {
  tokenFields?: string[] | undefined;
  headerFields?: string[] | undefined;
  session?: boolean | undefined;
  passReqToCallback?: false | undefined;
  params?: boolean | undefined;
  optional?: boolean | undefined;
  caseInsensitive?: boolean | undefined;
}
