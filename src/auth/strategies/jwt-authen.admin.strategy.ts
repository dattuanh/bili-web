import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import dayjs from 'dayjs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/common/config/app.config';
import { ExceptionSubCode } from '../../common/constants/exception.constant';
import { UnauthorizedExc } from '../../common/exceptions/custom.exception';
import { StrategyName } from '../constants/index.constant';
import { UserType } from '../enums/user.enum';
import { JwtAuthPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtAuthenAdminStrategy extends PassportStrategy(
  Strategy,
  StrategyName.ADMIN,
) {
  constructor(
    private readonly userRepo: UserRepository,
    configService: ConfigService<AppConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('auth.accessToken.secret'),
      algorithms: [configService.get('auth.accessToken.algorithm')],
    });
  }

  async validate(payload: JwtAuthPayload) {
    const { userId, exp } = payload;

    if (dayjs.unix(exp).isBefore(dayjs())) {
      throw new UnauthorizedExc({
        message: 'auth.common.expiredToken',
        subCode: ExceptionSubCode.EXPIRES_ACCESS_TOKEN,
      });
    }

    const user = await this.userRepo.findOneBy({
      id: userId,
      type: UserType.ADMIN,
    });

    if (!user) {
      throw new UnauthorizedExc({
        message: 'auth.common.invalidToken',
        subCode: ExceptionSubCode.INVALID_ACCESS_TOKEN,
      });
    }

    return user;
  }
}
