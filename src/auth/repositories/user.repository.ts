import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(User, dataSource);
    this.entityNameI18nKey = 'common.word.user';
  }
}
