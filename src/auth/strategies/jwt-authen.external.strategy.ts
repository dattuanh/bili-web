import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-http-header-strategy';
import { AppConfig } from 'src/common/config/app.config';
import { UnauthorizedExc } from '../../common/exceptions/custom.exception';
// import { ExternalTokenRepository } from '../../external/repositories/external-token.repository';
import { StrategyName } from '../constants/index.constant';

@Injectable()
export class AuthenExternalStrategy extends PassportStrategy(
  Strategy,
  StrategyName.EXTERNAL,
) {
  private dbSecretKey: string;
  constructor(
    configService: ConfigService<AppConfig>,
    // private externalTokenRepo: ExternalTokenRepository,
  ) {
    super({} as IStrategyOptions);

    this.dbSecretKey = configService.get('databaseSecretKey');
  }

  // async validate(token: string) {
  //   const externalToken = await this.externalTokenRepo
  //     .createQueryBuilder('et')
  //     .addSelect(`PGP_SYM_DECRYPT(et.token,'${this.dbSecretKey}')`, 'et_token')
  //     .where(`PGP_SYM_DECRYPT(token,'${this.dbSecretKey}') = :token`, {
  //       token,
  //     })
  //     .getOne();

  //   if (!externalToken) {
  //     throw new UnauthorizedExc({ message: 'auth.common.invalidToken' });
  //   }

  //   return externalToken;
  // }
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
