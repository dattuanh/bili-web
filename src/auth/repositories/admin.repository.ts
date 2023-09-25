import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Admin, dataSource);
    this.entityNameI18nKey = 'common.word.admin';
  }
}
