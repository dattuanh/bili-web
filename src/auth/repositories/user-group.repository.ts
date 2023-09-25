import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { UserGroup } from '../entities/user-group.entity';

@Injectable()
export class UserGroupRepository extends BaseRepository<UserGroup> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(UserGroup, dataSource);
    this.entityNameI18nKey = 'common.word.userGroup';
  }
}
