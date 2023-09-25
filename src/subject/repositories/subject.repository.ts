import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectRepository extends BaseRepository<Subject> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Subject, dataSource);
    this.entityNameI18nKey = 'common.word.subject';
  }
}
