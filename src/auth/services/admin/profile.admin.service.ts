import { Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ExpectationFailedExc } from '../../../common/exceptions/custom.exception';
import { EncryptService } from '../../../utils/services/encrypt.service';
import {
  ChangePasswordAdminReqDto,
  UpdateProfileAdminReqDto,
} from '../../dtos/admin/req/profile.admin.req.dto';
import { AdminResDto } from '../../dtos/common/res/admin.res.dto';
import { User } from '../../entities/user.entity';
import { AdminStatus } from '../../enums/admin.enum';
import { AdminRepository } from '../../repositories/admin.repository';

@Injectable()
export class ProfileAdminService {
  constructor(
    private adminRepo: AdminRepository,
    private encryptService: EncryptService,
  ) { }

  async getDetail(user: User) {
    const [admin] = await this.adminRepo.find({
      where: { userId: user.id, status: Not(AdminStatus.BANNED) },
      relations: {
        avatar: true,
        user: true,
        // relationLoadStrategy: 'query',
      }
    });

    return AdminResDto.forAdmin({ data: admin });
  }

  async update(dto: UpdateProfileAdminReqDto, user: User) {
    const { avatarId, name } = dto;

    const [admin] = await this.adminRepo.find({
      where: { userId: user.id, status: Not(AdminStatus.BANNED) },
    });

    const { affected } = await this.adminRepo.update(
      { id: admin.id, deletedAt: IsNull() },
      { avatarId, name },
    );

    if (!affected)
      throw new ExpectationFailedExc({
        message: 'common.exc.expectationFailed',
      });

    return this.getDetail(user);
  }

  @Transactional()
  async changePassword(dto: ChangePasswordAdminReqDto, user: User) {
    const { newPassword, password } = dto;

    let admin = user.admin;
    if (!admin || !admin.password) {
      admin = await this.adminRepo.findOneOrThrowNotFoundExc({
        where: { userId: user.id, status: AdminStatus.ACTIVE },
        select: { id: true, password: true },
      });
    }
    if (!this.encryptService.compareHash(password, admin.password)) {
      throw new ExpectationFailedExc({
        message: 'auth.common.wrongOldPassword',
      });
    }

    await this.adminRepo.update(admin.id, {
      password: this.encryptService.encryptText(newPassword),
    });
  }
}
