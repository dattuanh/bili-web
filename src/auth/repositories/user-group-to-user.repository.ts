import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { UserGroupToUser } from '../entities/user-group-to-user.entity';

@Injectable()
export class UserGroupToUserRepository extends BaseRepository<UserGroupToUser> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(UserGroupToUser, dataSource);
    this.entityNameI18nKey = 'common.word.userGroupToUser';
  }
}
