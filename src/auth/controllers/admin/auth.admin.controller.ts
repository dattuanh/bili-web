import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { AdminLoginReqDto } from '../../dtos/admin/req/auth.admin.req.dto';
import { RefreshTokenReqDto } from '../../dtos/common/req/auth.req.dto';
import { User } from '../../entities/user.entity';
import { AuthAdminService } from '../../services/admin/auth.admin.service';

@Controller(`${PrefixType.ADMIN}/auth`)
@ApiTags('Auth Admin')
export class AuthAdminController {
  constructor(private authAdminService: AuthAdminService) {}

  @Post('login')
  login(@Body() body: AdminLoginReqDto) {
    return this.authAdminService.login(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenReqDto) {
    return this.authAdminService.refreshToken(body);
  }

  @Get('current')
  @AuthenticateAdmin()
  getCurrent(@CurrentAuthData() user: User) {
    return this.authAdminService.getCurrent(user);
  }
}
