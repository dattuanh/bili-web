import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../../common/config/app.config';

@Injectable()
export class UserCommonService {
  constructor(
    private configService: ConfigService<AppConfig>,
    private jwtService: JwtService,
  ) {}

}
