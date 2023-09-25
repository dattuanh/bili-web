import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import {
  ChangePasswordAdminReqDto,
  UpdateProfileAdminReqDto,
} from '../../dtos/admin/req/profile.admin.req.dto';
import { User } from '../../entities/user.entity';
import { ProfileAdminService } from '../../services/admin/profile.admin.service';

@Controller(`${PrefixType.ADMIN}/profile`)
@AuthenticateAdmin()
@ApiTags('Profile Admin')
export class ProfileAdminController {
  constructor(private profileAdminService: ProfileAdminService) {}

  @Get()
  getDetail(@CurrentAuthData() user: User) {
    return this.profileAdminService.getDetail(user);
  }

  @Patch('password')
  changePassword(
    @Body() body: ChangePasswordAdminReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.profileAdminService.changePassword(body, user);
  }

  @Put()
  update(
    @Body() body: UpdateProfileAdminReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.profileAdminService.update(body, user);
  }
}
